export type RateLimitAction =
    | 'sign-up'
    | 'sign-up-otp'
    | 'sign-in'
    | 'password-reset'
    | 'password-reset-otp'
    | 'change-email'
    | 'change-email-otp';

export type ConsumeRateLimitParams = {
    action: RateLimitAction;
    identifier: string;
    max: number;
    attemptLifetimeSeconds: number;
};

export type ConsumeRateLimitResult = {
    attempts: number;
    remainingAttempts: number;
};

export type ActiveRateLimit = {
    expiresAt: number;
};
