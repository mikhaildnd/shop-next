import type { BetterAuthPlugin } from 'better-auth';
import {
    createAuthEndpoint,
    createAuthMiddleware,
    getSessionFromCtx,
    sensitiveSessionMiddleware,
} from 'better-auth/api';

import { PENDING_ACCOUNT_MERGE_COOKIE } from '@/auth/auth.constants';
import type { PendingAccountMerge } from '@/auth/auth.types';
import { prisma } from '@/db';
import { mergeAnonymousCart } from '@/services/cart/cart.service';

export function accountMergePlugin() {
    return {
        id: 'account-merge',
        hooks: {
            after: [
                {
                    matcher: (context) =>
                        context.path === '/sign-in/email' ||
                        context.path === '/verify-email-otp',
                    handler: createAuthMiddleware(async (ctx) => {
                        const newSession = ctx.context.newSession;

                        if (!newSession || newSession.user.isAnonymous) {
                            return;
                        }

                        const pendingMergeCookie = await ctx.getSignedCookie(
                            PENDING_ACCOUNT_MERGE_COOKIE,
                            ctx.context.secret,
                        );

                        if (!pendingMergeCookie) {
                            return;
                        }

                        let pendingMerge: PendingAccountMerge;

                        try {
                            pendingMerge = JSON.parse(pendingMergeCookie);
                        } catch {
                            await ctx.setSignedCookie(
                                PENDING_ACCOUNT_MERGE_COOKIE,
                                '',
                                ctx.context.secret,
                                { maxAge: 0 },
                            );
                            return;
                        }

                        if (pendingMerge.userId !== newSession.user.id) {
                            return;
                        }

                        const anonymousUser = await prisma.user.findUnique({
                            where: {
                                id: pendingMerge.anonymousUserId,
                            },
                            select: {
                                id: true,
                                isAnonymous: true,
                            },
                        });

                        if (!anonymousUser || !anonymousUser.isAnonymous) {
                            await ctx.setSignedCookie(
                                PENDING_ACCOUNT_MERGE_COOKIE,
                                '',
                                ctx.context.secret,
                                { maxAge: 0 },
                            );
                            return;
                        }

                        try {
                            await mergeAnonymousCart(
                                anonymousUser.id,
                                newSession.user.id,
                            );

                            await ctx.context.internalAdapter.deleteUser(
                                anonymousUser.id,
                            );

                            await ctx.setSignedCookie(
                                PENDING_ACCOUNT_MERGE_COOKIE,
                                '',
                                ctx.context.secret,
                                { maxAge: 0 },
                            );
                        } catch (error) {
                            ctx.context.logger.error(
                                'Failed to auto-retry anonymous cart merge',
                                {
                                    anonymousUserId: anonymousUser.id,
                                    userId: newSession.user.id,
                                    error,
                                },
                            );
                        }
                    }),
                },
            ],
        },
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

                    if (!pendingMergeCookie) {
                        return ctx.json({
                            hasPendingMerge: false,
                        });
                    }

                    let pendingMerge: PendingAccountMerge;

                    try {
                        pendingMerge = JSON.parse(pendingMergeCookie);
                    } catch {
                        await ctx.setSignedCookie(
                            PENDING_ACCOUNT_MERGE_COOKIE,
                            '',
                            ctx.context.secret,
                            {
                                maxAge: 0,
                            },
                        );

                        return ctx.json({
                            hasPendingMerge: false,
                        });
                    }

                    return ctx.json({
                        hasPendingMerge:
                            pendingMerge.userId === session.user.id,
                    });
                },
            ),
            retryAccountMerge: createAuthEndpoint(
                '/account-merge/retry',
                {
                    method: 'POST',
                    use: [sensitiveSessionMiddleware],
                },
                async (ctx) => {
                    const session = ctx.context.session;

                    if (!session || session.user.isAnonymous) {
                        return ctx.json({
                            success: false,
                            cart: null,
                        });
                    }

                    const pendingMergeCookie = await ctx.getSignedCookie(
                        PENDING_ACCOUNT_MERGE_COOKIE,
                        ctx.context.secret,
                    );

                    if (!pendingMergeCookie) {
                        return ctx.json({
                            success: true,
                            cart: null,
                        });
                    }

                    let pendingMerge: PendingAccountMerge;

                    try {
                        pendingMerge = JSON.parse(pendingMergeCookie);
                    } catch {
                        await ctx.setSignedCookie(
                            PENDING_ACCOUNT_MERGE_COOKIE,
                            '',
                            ctx.context.secret,
                            {
                                maxAge: 0,
                            },
                        );

                        return ctx.json({
                            success: true,
                            cart: null,
                        });
                    }

                    if (pendingMerge.userId !== session.user.id) {
                        return ctx.json({
                            success: false,
                            cart: null,
                        });
                    }

                    const anonymousUser = await prisma.user.findUnique({
                        where: {
                            id: pendingMerge.anonymousUserId,
                        },
                        select: {
                            id: true,
                            isAnonymous: true,
                        },
                    });

                    if (!anonymousUser || !anonymousUser.isAnonymous) {
                        await ctx.setSignedCookie(
                            PENDING_ACCOUNT_MERGE_COOKIE,
                            '',
                            ctx.context.secret,
                            {
                                maxAge: 0,
                            },
                        );

                        return ctx.json({
                            success: true,
                            cart: null,
                        });
                    }

                    try {
                        const cart = await mergeAnonymousCart(
                            anonymousUser.id,
                            session.user.id,
                        );

                        await ctx.context.internalAdapter.deleteUser(
                            anonymousUser.id,
                        );

                        await ctx.setSignedCookie(
                            PENDING_ACCOUNT_MERGE_COOKIE,
                            '',
                            ctx.context.secret,
                            {
                                maxAge: 0,
                            },
                        );

                        return ctx.json({
                            success: true,
                            cart,
                        });
                    } catch (error) {
                        ctx.context.logger.error(
                            'Failed to retry anonymous cart merge',
                            {
                                anonymousUserId: anonymousUser.id,
                                userId: session.user.id,
                                error,
                            },
                        );

                        return ctx.json({
                            success: false,
                            cart: null,
                        });
                    }
                },
            ),
        },
    } satisfies BetterAuthPlugin;
}
