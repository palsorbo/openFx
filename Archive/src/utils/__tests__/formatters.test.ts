import { formatCurrency, formatRate, formatTimeRemaining, isQuoteExpired, generateId } from '../formatters';

describe('formatters', () => {
    describe('formatCurrency', () => {
        it('should format USD correctly', () => {
            expect(formatCurrency(100.5, 'USD')).toBe('$100.50');
            expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
        });

        it('should format EUR correctly', () => {
            expect(formatCurrency(100.5, 'EUR')).toBe('€100.50');
        });

        it('should format GBP correctly', () => {
            expect(formatCurrency(100.5, 'GBP')).toBe('£100.50');
        });

        it('should format JPY correctly', () => {
            expect(formatCurrency(100.5, 'JPY')).toBe('¥100.50');
        });

        it('should format INR correctly', () => {
            expect(formatCurrency(100.5, 'INR')).toBe('₹100.50');
        });
    });

    describe('formatRate', () => {
        it('should format rates with 4 decimal places', () => {
            expect(formatRate(0.85)).toBe('0.8500');
            expect(formatRate(1.123456)).toBe('1.1235');
            expect(formatRate(0.123456)).toBe('0.1235');
        });
    });

    describe('formatTimeRemaining', () => {
        it('should show "Expired" when time is up', () => {
            const expiredTime = Date.now() - 1000;
            expect(formatTimeRemaining(expiredTime)).toBe('Expired');
        });

        it('should format time remaining correctly', () => {
            const futureTime = Date.now() + 90000; // 1.5 minutes
            const result = formatTimeRemaining(futureTime);
            expect(result).toMatch(/^1:[0-5][0-9]$/);
        });

        it('should pad seconds with leading zero', () => {
            const futureTime = Date.now() + 65000; // 1 minute 5 seconds
            expect(formatTimeRemaining(futureTime)).toBe('1:05');
        });
    });

    describe('isQuoteExpired', () => {
        it('should return true for expired quotes', () => {
            const expiredTime = Date.now() - 1000;
            expect(isQuoteExpired(expiredTime)).toBe(true);
        });

        it('should return false for valid quotes', () => {
            const validTime = Date.now() + 60000;
            expect(isQuoteExpired(validTime)).toBe(false);
        });
    });

    describe('generateId', () => {
        it('should generate unique IDs', () => {
            const id1 = generateId();
            const id2 = generateId();
            expect(id1).not.toBe(id2);
            expect(typeof id1).toBe('string');
            expect(id1.length).toBeGreaterThan(0);
        });
    });
});