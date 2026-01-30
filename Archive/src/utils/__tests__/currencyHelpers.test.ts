import { getAvailableCurrencies, isValidCurrencyPair } from '../currencyHelpers';

describe('currencyHelpers', () => {
    describe('getAvailableCurrencies', () => {
        it('should return all currencies except the current selection', () => {
            const result = getAvailableCurrencies('USD');
            expect(result).toHaveLength(4);
            expect(result).not.toContainEqual({ code: 'USD', name: 'US Dollar' });
            expect(result).toContainEqual({ code: 'EUR', name: 'Euro' });
        });

        it('should return empty array if current selection is not in list', () => {
            const result = getAvailableCurrencies('XYZ' as any);
            expect(result).toHaveLength(5);
        });
    });

    describe('isValidCurrencyPair', () => {
        it('should return true for valid currency pairs', () => {
            expect(isValidCurrencyPair('USD', 'EUR')).toBe(true);
            expect(isValidCurrencyPair('EUR', 'GBP')).toBe(true);
            expect(isValidCurrencyPair('JPY', 'INR')).toBe(true);
        });

        it('should return false for same currency pair', () => {
            expect(isValidCurrencyPair('USD', 'USD')).toBe(false);
            expect(isValidCurrencyPair('EUR', 'EUR')).toBe(false);
        });

        it('should return false for invalid currencies', () => {
            expect(isValidCurrencyPair('XYZ' as any, 'USD')).toBe(false);
            expect(isValidCurrencyPair('USD', 'ABC' as any)).toBe(false);
            expect(isValidCurrencyPair('XYZ' as any, 'ABC' as any)).toBe(false);
        });
    });
});