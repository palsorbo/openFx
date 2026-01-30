import type { CurrencyCode } from '../types';
import { CURRENCIES } from '../constants/currencies';

export const getAvailableCurrencies = (
    currentSelection: CurrencyCode,
    allCurrencies: { code: CurrencyCode; name: string }[] = CURRENCIES
): { code: CurrencyCode; name: string }[] => {
    return allCurrencies.filter(currency => currency.code !== currentSelection);
};

export const isValidCurrencyPair = (
    sourceCurrency: CurrencyCode,
    destinationCurrency: CurrencyCode
): boolean => {
    return sourceCurrency !== destinationCurrency &&
        CURRENCIES.some(c => c.code === sourceCurrency) &&
        CURRENCIES.some(c => c.code === destinationCurrency);
};