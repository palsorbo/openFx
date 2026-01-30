import type { CurrencyCode } from '../types';

export const CURRENCIES: { code: CurrencyCode; name: string }[] = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'INR', name: 'Indian Rupee' }
];

export const CURRENCY_CODES: CurrencyCode[] = CURRENCIES.map(c => c.code);