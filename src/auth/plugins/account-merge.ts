import type { BetterAuthPlugin } from 'better-auth';
import {
    createAuthEndpoint,
    getSessionFromCtx,
    sensitiveSessionMiddleware,
} from 'better-auth/api';

import type { AccountMergeResult } from '@/auth/account-merge.types';
import { PENDING_ACCOUNT_MERGE_COOKIE } from '@/auth/auth.constants';
import { prisma } from '@/db';
import { mergeAnonymousAccountData } from '@/services/account/account-merge.service';

type AccountMergePreparation =
    | {
          success: true;
          anonymousUserId: string;
          userId: string;
      }
    | {
          success: false;
          reason:
              | 'missing-cookie'
              | 'invalid-cookie'
              | 'different-user'
              | 'merge-completed'
              | 'merge-dismissed'
              | 'invalid-anonymous-user';
      };

async function prepareAccountMerge(
    pendingMergeCookie: string | false | null,
    sessionUserId: string,
): Promise<AccountMergePreparation> {
    if (!pendingMergeCookie) {
        return { success: false, reason: 'missing-cookie' };
    }

    let pendingMerge: unknown;

    try {
        pendingMerge = JSON.parse(pendingMergeCookie);
    } catch {
        return { success: false, reason: 'invalid-cookie' };
    }

    if (
        typeof pendingMerge !== 'object' ||
        pendingMerge === null ||
        !('userId' in pendingMerge) ||
        typeof pendingMerge.userId !== 'string' ||
        !('anonymousUserId' in pendingMerge) ||
        typeof pendingMerge.anonymousUserId !== 'string' ||
        !pendingMerge.anonymousUserId
    ) {
        return { success: false, reason: 'invalid-cookie' };
    }

    if (pendingMerge.userId !== sessionUserId) {
        return { success: false, reason: 'different-user' };
    }

    const anonymousUser = await prisma.user.findUnique({
        where: { id: pendingMerge.anonymousUserId },
        select: {
            id: true,
            isAnonymous: true,
            mergeTargetUserId: true,
            mergeCompletedAt: true,
            mergeDismissedAt: true,
        },
    });

    if (
        anonymousUser?.isAnonymous !== true ||
        anonymousUser.mergeTargetUserId !== sessionUserId
    ) {
        return { success: false, reason: 'invalid-anonymous-user' };
    }

    if (anonymousUser.mergeCompletedAt !== null) {
        return { success: false, reason: 'merge-completed' };
    }

    if (anonymousUser.mergeDismissedAt !== null) {
        return { success: false, reason: 'merge-dismissed' };
    }

    return {
        success: true,
        anonymousUserId: anonymousUser.id,
        userId: sessionUserId,
    };
}

export function accountMergePlugin() {
    return {
        id: 'account-merge',
        endpoints: {
            getPendingAccountMerge: createAuthEndpoint(
                '/account-merge/pending',
                {
                    method: 'GET',
                },
                async (ctx) => {
                    const session = await getSessionFromCtx(ctx);

                    if (!session || session.user.isAnonymous) {
                        return ctx.json({
                            hasPendingMerge: false,
                        });
                    }

                    const pendingMergeCookie = await ctx.getSignedCookie(
                        PENDING_ACCOUNT_MERGE_COOKIE,
                        ctx.context.secret,
                    );

                    const preparation = await prepareAccountMerge(
                        pendingMergeCookie,
                        session.user.id,
                    );

                    return ctx.json({
                        hasPendingMerge: preparation.success,
                    });
                },
            ),
            retryAccountMerge: createAuthEndpoint(
                '/account-merge/retry',
                {
                    method: 'POST',
                    use: [sensitiveSessionMiddleware],
                },
                async (ctx): Promise<AccountMergeResult> => {
                    const session = ctx.context.session;

                    if (!session || session.user.isAnonymous) {
                        return ctx.json({
                            status: 'unavailable',
                        });
                    }

                    const pendingMergeCookie = await ctx.getSignedCookie(
                        PENDING_ACCOUNT_MERGE_COOKIE,
                        ctx.context.secret,
                    );

                    const preparation = await prepareAccountMerge(
                        pendingMergeCookie,
                        session.user.id,
                    );

                    if (!preparation.success) {
                        return ctx.json({ status: 'unavailable' });
                    }

                    const { anonymousUserId, userId } = preparation;

                    try {
                        const result = await mergeAnonymousAccountData(
                            anonymousUserId,
                            userId,
                        );

                        if (result === 'unavailable') {
                            return ctx.json({ status: 'unavailable' });
                        }
                    } catch (error) {
                        ctx.context.logger.error(
                            'Failed to retry account data merge',
                            {
                                anonymousUserId,
                                userId,
                                error,
                            },
                        );

                        return ctx.json({ status: 'failed' });
                    }

                    try {
                        await ctx.setSignedCookie(
                            PENDING_ACCOUNT_MERGE_COOKIE,
                            '',
                            ctx.context.secret,
                            { maxAge: 0 },
                        );
                    } catch (error) {
                        ctx.context.logger.error(
                            'Failed to clear pending account merge cookie',
                            {
                                anonymousUserId,
                                userId,
                                error,
                            },
                        );
                    }

                    try {
                        await ctx.context.internalAdapter.deleteUser(
                            anonymousUserId,
                        );
                    } catch (error) {
                        ctx.context.logger.error(
                            'Failed to delete anonymous user after account merge',
                            {
                                anonymousUserId,
                                userId,
                                error,
                            },
                        );
                    }

                    return ctx.json({ status: 'success' });
                },
            ),
            cancelAccountMerge: createAuthEndpoint(
                '/account-merge/cancel',
                {
                    method: 'POST',
                    use: [sensitiveSessionMiddleware],
                },
                async (ctx): Promise<AccountMergeResult> => {
                    const session = ctx.context.session;

                    if (!session || session.user.isAnonymous) {
                        return ctx.json({ status: 'unavailable' });
                    }

                    const pendingMergeCookie = await ctx.getSignedCookie(
                        PENDING_ACCOUNT_MERGE_COOKIE,
                        ctx.context.secret,
                    );

                    const preparation = await prepareAccountMerge(
                        pendingMergeCookie,
                        session.user.id,
                    );

                    if (!preparation.success) {
                        if (
                            preparation.reason === 'missing-cookie' ||
                            preparation.reason === 'different-user'
                        ) {
                            return ctx.json({ status: 'unavailable' });
                        }

                        await ctx.setSignedCookie(
                            PENDING_ACCOUNT_MERGE_COOKIE,
                            '',
                            ctx.context.secret,
                            { maxAge: 0 },
                        );

                        return ctx.json({ status: 'unavailable' });
                    }

                    const { anonymousUserId, userId } = preparation;

                    let result: { count: number };

                    try {
                        result = await prisma.user.updateMany({
                            where: {
                                id: anonymousUserId,
                                isAnonymous: true,
                                mergeTargetUserId: userId,
                                mergeCompletedAt: null,
                                mergeDismissedAt: null,
                                mergeOperationId: null,
                            },
                            data: {
                                mergeDismissedAt: new Date(),
                            },
                        });
                    } catch (error) {
                        ctx.context.logger.error(
                            'Failed to cancel account merge',
                            { anonymousUserId, userId, error },
                        );

                        return ctx.json({ status: 'failed' });
                    }

                    if (result.count !== 1) {
                        return ctx.json({ status: 'unavailable' });
                    }

                    try {
                        await ctx.context.internalAdapter.deleteUser(
                            anonymousUserId,
                        );
                    } catch (error) {
                        ctx.context.logger.error(
                            'Failed to delete anonymous user after account merge cancellation',
                            { anonymousUserId, userId, error },
                        );
                    }

                    try {
                        await ctx.setSignedCookie(
                            PENDING_ACCOUNT_MERGE_COOKIE,
                            '',
                            ctx.context.secret,
                            { maxAge: 0 },
                        );
                    } catch (error) {
                        ctx.context.logger.error(
                            'Failed to clear pending account merge cookie',
                            { anonymousUserId, userId, error },
                        );
                    }

                    return ctx.json({ status: 'success' });
                },
            ),
        },
    } satisfies BetterAuthPlugin;
}
