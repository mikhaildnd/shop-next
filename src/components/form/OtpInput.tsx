'use client';

import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';
import { useRef, useState } from 'react';

import { Input } from '@/components/shared/Input';

interface OtpInputProps {
    name: string;
    length?: number;
    error?: string;
}

// TODO:
// Consider replacing the multi-input OTP with a single input rendered as visual slots.
// The current implementation works correctly in modern browsers and iOS 16+,
// but automatic focus transition has issues on older Safari (iOS 15).
// A single input would provide better compatibility and simplify the implementation.

export function OtpInput({ name, length = 6, error }: OtpInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [digits, setDigits] = useState(() =>
        Array.from({ length }, () => ''),
    );

    const otpValue = digits.join('');

    function focusInput(index: number) {
        const input = inputRefs.current[index];

        if (!input) {
            return;
        }

        input.focus();
    }

    function setDigit(index: number, digit: string) {
        setDigits((prev) => {
            const nextDigits = [...prev];
            nextDigits[index] = digit;

            return nextDigits;
        });
    }

    const handleChange = (
        index: number,
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const input = event.currentTarget;

        const digit = input.value.replace(/\D/g, '').at(-1) ?? '';

        if (!digit) {
            setDigit(index, '');

            return;
        }

        setDigit(index, digit);

        const nextIndex = index + 1;

        if (nextIndex >= length) {
            return;
        }

        if (!digits[nextIndex]) {
            focusInput(nextIndex);
        }
    };

    const handleKeyDown = (
        index: number,
        event: KeyboardEvent<HTMLInputElement>,
    ) => {
        const isShortcut = event.ctrlKey || event.metaKey;

        if (!isShortcut && event.key.length === 1 && !/\d/.test(event.key)) {
            event.preventDefault();
        }

        switch (event.key) {
            case 'Backspace': {
                if (digits[index]) {
                    setDigit(index, '');
                    return;
                }

                if (index > 0) {
                    setDigit(index - 1, '');
                    focusInput(index - 1);
                }

                return;
            }

            case 'ArrowLeft': {
                event.preventDefault();

                if (index > 0) {
                    focusInput(index - 1);
                }

                return;
            }

            case 'ArrowRight': {
                event.preventDefault();

                if (index < length - 1) {
                    focusInput(index + 1);
                }

                return;
            }

            default:
                return;
        }
    };

    const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
        event.preventDefault();

        const pastedText = event.clipboardData.getData('text');

        const normalizedOtp = pastedText.replace(/\D/g, '').slice(0, length);

        if (!normalizedOtp) {
            return;
        }

        const nextDigits = Array.from(
            { length },
            (_, index) => normalizedOtp[index] ?? '',
        );

        setDigits(nextDigits);

        focusInput(normalizedOtp.length - 1);
    };

    return (
        <div className="flex flex-col gap-2">
            <input
                type="hidden"
                name={name}
                value={otpValue}
            />

            <div
                className="flex gap-2"
                onPaste={handlePaste}
            >
                {digits.map((digit, index) => (
                    <Input
                        type="text"
                        className="aspect-square w-full p-0 text-center text-xl font-semibold"
                        key={index}
                        ref={(element) => {
                            inputRefs.current[index] = element;
                        }}
                        value={digit}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        aria-invalid={!!error}
                        onChange={(event) => handleChange(index, event)}
                        onKeyDown={(event) => handleKeyDown(index, event)}
                        onFocus={(event) => event.currentTarget.select()}
                    />
                ))}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
