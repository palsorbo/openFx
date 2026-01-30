import { renderHook, act } from '@testing-library/react';
import { useTransactionPolling } from '../useTransactionPolling';
import { getTransaction } from '../../services/api';

// Mock the API
jest.mock('../../services/api');

const mockGetTransaction = getTransaction as jest.MockedFunction<typeof getTransaction>;

describe('useTransactionPolling', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should fetch transaction on mount', async () => {
        const mockTransaction = {
            transactionId: 'test-id',
            status: 'processing' as const,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            quoteId: 'quote-123',
            sourceCurrency: 'USD' as const,
            destinationCurrency: 'EUR' as const,
            amount: 100,
            rate: 0.85,
            fees: 5,
            totalPayable: 105
        };

        mockGetTransaction.mockResolvedValue(mockTransaction);

        const { result } = renderHook(() => useTransactionPolling('test-id'));

        expect(mockGetTransaction).toHaveBeenCalledWith('test-id');
        expect(result.current.transaction).toEqual(mockTransaction);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('should handle API errors', async () => {
        mockGetTransaction.mockRejectedValue(new Error('Transaction not found'));

        const { result } = renderHook(() => useTransactionPolling('invalid-id'));

        expect(result.current.error).toBe('Transaction not found');
        expect(result.current.loading).toBe(false);
        expect(result.current.polling).toBe(false);
    });

    it('should stop polling when transaction is settled', async () => {
        const settledTransaction = {
            transactionId: 'test-id',
            status: 'settled' as const,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            quoteId: 'quote-123',
            sourceCurrency: 'USD' as const,
            destinationCurrency: 'EUR' as const,
            amount: 100,
            rate: 0.85,
            fees: 5,
            totalPayable: 105
        };

        mockGetTransaction.mockResolvedValue(settledTransaction);

        const { result } = renderHook(() => useTransactionPolling('test-id'));

        // Initial fetch
        expect(mockGetTransaction).toHaveBeenCalledTimes(1);

        // Fast forward 3 seconds
        act(() => {
            jest.advanceTimersByTime(3000);
        });

        // Should not have made additional calls since transaction is settled
        expect(mockGetTransaction).toHaveBeenCalledTimes(1);
        expect(result.current.polling).toBe(false);
    });

    it('should continue polling for processing transactions', async () => {
        const processingTransaction = {
            transactionId: 'test-id',
            status: 'processing' as const,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            quoteId: 'quote-123',
            sourceCurrency: 'USD' as const,
            destinationCurrency: 'EUR' as const,
            amount: 100,
            rate: 0.85,
            fees: 5,
            totalPayable: 105
        };

        mockGetTransaction.mockResolvedValue(processingTransaction);

        const { result } = renderHook(() => useTransactionPolling('test-id'));

        // Initial fetch
        expect(mockGetTransaction).toHaveBeenCalledTimes(1);

        // Fast forward 3 seconds
        act(() => {
            jest.advanceTimersByTime(3000);
        });

        // Should have made another call
        expect(mockGetTransaction).toHaveBeenCalledTimes(2);
        expect(result.current.polling).toBe(true);
    });

    it('should update countdown timer', async () => {
        const mockTransaction = {
            transactionId: 'test-id',
            status: 'processing' as const,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            quoteId: 'quote-123',
            sourceCurrency: 'USD' as const,
            destinationCurrency: 'EUR' as const,
            amount: 100,
            rate: 0.85,
            fees: 5,
            totalPayable: 105
        };

        mockGetTransaction.mockResolvedValue(mockTransaction);

        const { result } = renderHook(() => useTransactionPolling('test-id'));

        // Initial countdown should be 3s
        expect(result.current.countdown).toBe('3s');

        // Fast forward 1 second
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.countdown).toBe('2s');

        // Fast forward 2 more seconds
        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(result.current.countdown).toBe('Updating...');
    });

    it('should handle retry functionality', async () => {
        // First call fails
        mockGetTransaction.mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() => useTransactionPolling('test-id'));

        // Should have error
        expect(result.current.error).toBe('Network error');
        expect(result.current.polling).toBe(false);

        // Retry
        act(() => {
            result.current.handleRetry();
        });

        // Should clear error and restart polling
        expect(result.current.error).toBe(null);
        expect(result.current.polling).toBe(true);
        expect(mockGetTransaction).toHaveBeenCalledTimes(2);
    });
});