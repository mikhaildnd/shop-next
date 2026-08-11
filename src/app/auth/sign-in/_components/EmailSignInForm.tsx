'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import { sendVerificationOtp, signIn } from '@/app/auth/sign-in/actions';
import { FormGroup } from '@/components/form/FormGroup';
import { FormInput } from '@/components/form/FormInput';
import { LoadingButton } from '@/components/shared/button/LoadingButton';
import { Label } from '@/components/shared/Label';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { routes } from '@/lib/routes';

export function EmailSignInForm() {
    const [state, formAction, isPending] = useActionState(signIn, {});

    const expiresAt = state.activeRateLimit?.expiresAt;

    const { secondsLeft, isRunning } = useCountdownTimer(expiresAt);

    const [verificationState, verificationAction, isVerificationPending] =
        useActionState(sendVerificationOtp, {});

    const verificationExpiresAt = verificationState.activeRateLimit?.expiresAt;

    const isVerificationRequired = state.requiresEmailVerification;

    const {
        secondsLeft: verificationSecondsLeft,
        isRunning: isVerificationRateLimitRunning,
    } = useCountdownTimer(verificationExpiresAt);

    return (
        <>
            <form
                className="flex flex-col gap-4"
                action={formAction}
                noValidate
            >
                <FormGroup error={state.fieldErrors?.email}>
                    <Label htmlFor="email">E-mail</Label>
                    <FormInput
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        defaultValue={state.values?.email}
                        error={state.fieldErrors?.email}
                    />
                </FormGroup>

                <FormGroup
                    error={state.fieldErrors?.password}
                    className="relative"
                >
                    <Label htmlFor="password">Пароль</Label>
                    <FormInput
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        error={state.fieldErrors?.password}
                    />
                    <div className="absolute top-0 right-0 flex justify-center">
                        <p className="text-sm">
                            <Link
                                href={routes.passwordResetPage()}
                                className="link-style focus-ring"
                            >
                                Забыли пароль?
                            </Link>
                        </p>
                    </div>
                </FormGroup>

                {state.formError && !isVerificationRequired && (
                    <p className="text-sm text-red-500">{state.formError}</p>
                )}

                <LoadingButton
                    type="submit"
                    isLoading={isPending}
                    disabled={isPending || isRunning}
                >
                    Войти
                </LoadingButton>

                {state.remainingAttempts !== undefined &&
                    state.remainingAttempts > 0 && (
                        <p className="text-sm">
                            Осталось попыток: {state.remainingAttempts}
                        </p>
                    )}

                {isRunning && (
                    <p className="text-sm text-red-500">
                        Повторите попытку через {secondsLeft} сек.
                    </p>
                )}
            </form>

            {isVerificationRequired && (
                <div className="flex flex-col gap-3">
                    <p className="text-sm text-red-500">{state.formError}</p>

                    <form
                        action={verificationAction}
                        className="flex w-full flex-col gap-2"
                    >
                        <input
                            type="hidden"
                            name="email"
                            value={state.values?.email ?? ''}
                        />

                        <LoadingButton
                            type="submit"
                            variant="outline"
                            isLoading={isVerificationPending}
                            disabled={
                                isVerificationPending ||
                                isVerificationRateLimitRunning
                            }
                        >
                            Отправить код подтверждения
                        </LoadingButton>

                        {isVerificationRateLimitRunning && (
                            <p className="text-sm text-red-500">
                                Повторите попытку через{' '}
                                {verificationSecondsLeft} сек.
                            </p>
                        )}

                        {verificationState.formError && (
                            <p className="text-sm text-red-500">
                                {' '}
                                {verificationState.formError}{' '}
                            </p>
                        )}
                    </form>
                </div>
            )}
        </>
    );
}
