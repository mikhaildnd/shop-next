export type RateLimitAction =
    | 'sign-up'
    | 'sign-in'
    | 'password-reset'
    | 'change-email';

export type CheckRateLimitParams = {
    action: RateLimitAction;
    identifier: string;

    windowSeconds: number;
    max: number;
};

export type CheckRateLimitResult = {
    allowed: boolean;
    attempts: number;
    remainingAttempts: number;
    retryAfterSeconds: number;
};

export interface RateLimitState {
    retryAfterSeconds: number;
    remainingAttempts: number;
    attempts: number;
}
