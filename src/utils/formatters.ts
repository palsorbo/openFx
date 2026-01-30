import type { CurrencyCode } from '../types';

export const formatCurrency = (amount: number, currency: CurrencyCode): string => {
    const currencySymbols: Record<CurrencyCode, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        INR: '₹'
    };

    return `${currencySymbols[currency]}${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

export const formatRate = (rate: number): string => {
    return rate.toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
    });
};

export const formatTimeRemaining = (expiryTime: number): string => {
    const now = Date.now();
    const remaining = expiryTime - now;

    if (remaining <= 0) {
        return 'Expired';
    }

    const seconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const isQuoteExpired = (expiryTime: number): boolean => {
    return Date.now() >= expiryTime;
};

export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};