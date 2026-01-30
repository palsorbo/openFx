import { useState, useEffect } from 'react';
import type { Transaction } from '../types';
import { getTransaction } from '../services/api';
import { TRANSACTION_POLLING_INTERVAL } from '../constants/timeouts';

export const useTransactionPolling = (transactionId: string) => {
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [polling, setPolling] = useState(true);
    const [countdown, setCountdown] = useState<string>('3s');

    useEffect(() => {
        let interval: number;

        const fetchTransaction = async () => {
            try {
                const result = await getTransaction(transactionId);
                setTransaction(result);
                setLoading(false);

                // Stop polling if transaction is complete
                if (result.status === 'settled' || result.status === 'failed') {
                    setPolling(false);
                }
            } catch (err) {
                setLoading(false);
                setError(err instanceof Error ? err.message : 'Failed to fetch transaction status');
                setPolling(false);
            }
        };

        // Initial fetch
        fetchTransaction();

        // Set up polling every 3 seconds
        if (polling) {
            interval = setInterval(fetchTransaction, TRANSACTION_POLLING_INTERVAL) as unknown as number;

            // Set up countdown timer
            let countdownTimer: number;
            let seconds = 3;

            const updateCountdown = () => {
                if (seconds > 0) {
                    setCountdown(`${seconds}s`);
                    seconds--;
                } else {
                    setCountdown('Updating...');
                    seconds = 3;
                }
            };

            updateCountdown();
            countdownTimer = setInterval(updateCountdown, 1000) as unknown as number;

            return () => {
                if (interval) {
                    clearInterval(interval);
                }
                if (countdownTimer) {
                    clearInterval(countdownTimer);
                }
            };
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [transactionId, polling]);

    const handleRetry = () => {
        setLoading(true);
        setError(null);
        setPolling(true);
    };

    return {
        transaction,
        loading,
        error,
        polling,
        countdown,
        handleRetry
    };
};