import React, { useState, useEffect } from 'react';
import type { StatusScreenProps, Transaction } from '../types';
import { LoadingSpinner } from './common/LoadingSpinner';
import { ErrorMessage } from './common/ErrorMessage';
import { TransactionDetails } from './common/TransactionDetails';
import { PollingCountdownTimer } from './common/PollingCountdownTimer';
import { getStatusColor, getStatusText } from '../utils/statusHelpers';
import { useTransactionPolling } from '../hooks/useTransactionPolling';
import { useTransactionStore } from '../store/transactionStore';

export const StatusScreen: React.FC<StatusScreenProps> = ({
    transactionId
}) => {
    const { resetTransaction } = useTransactionStore();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [polling, setPolling] = useState(true);

    const {
        transaction: polledTransaction,
        loading: polledLoading,
        error: polledError,
        polling: polledPolling,
        handleRetry: polledHandleRetry
    } = useTransactionPolling(transactionId);

    // Update local state with polling results
    useEffect(() => {
        if (polledTransaction) {
            setTransaction(polledTransaction);
        }
        setLoading(polledLoading);
        setError(polledError);
        setPolling(polledPolling);
    }, [polledTransaction, polledLoading, polledError, polledPolling]);

    const handleRetry = () => {
        setLoading(true);
        setError(null);
        setPolling(true);
        polledHandleRetry();
    };

    if (loading) {
        return <LoadingSpinner message="Fetching transaction status..." />;
    }

    if (error) {
        return (
            <div className="status-screen">
                <h1>Transaction Status</h1>
                <ErrorMessage
                    message={error}
                    onRetry={handleRetry}
                />
                <button className="new-transaction-btn" onClick={resetTransaction}>
                    Start New Transaction
                </button>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="status-screen">
                <h1>Transaction Status</h1>
                <ErrorMessage
                    message="Transaction not found"
                    onRetry={handleRetry}
                />
                <button className="new-transaction-btn" onClick={resetTransaction}>
                    Start New Transaction
                </button>
            </div>
        );
    }

    return (
        <div className="status-screen">
            <h1>Transaction Status</h1>

            <div className="status-card">
                <div className="status-header">
                    <h2>Transaction #{transaction.transactionId}</h2>
                    <div
                        className="status-badge"
                        style={{ borderColor: getStatusColor(transaction.status) }}
                    >
                        <span
                            className="status-dot"
                            style={{ backgroundColor: getStatusColor(transaction.status) }}
                        ></span>
                        <span className="status-text">{getStatusText(transaction.status)}</span>
                    </div>
                </div>

                <TransactionDetails
                    sourceCurrency={transaction.sourceCurrency}
                    destinationCurrency={transaction.destinationCurrency}
                    amount={transaction.amount}
                    rate={transaction.rate}
                    fees={transaction.fees}
                    totalPayable={transaction.totalPayable}
                    showMetadata={true}
                    createdAt={transaction.createdAt}
                    updatedAt={transaction.updatedAt}
                    transactionId={transaction.transactionId}
                    className="transaction-details"
                />

                {transaction.status === 'failed' && (
                    <div className="failure-actions">
                        <ErrorMessage
                            message="Transaction failed. Please try again or contact support."
                        />
                        <button className="retry-transaction-btn" onClick={handleRetry}>
                            Retry Status Check
                        </button>
                    </div>
                )}

                {transaction.status === 'settled' && (
                    <div className="success-actions">
                        <div className="success-message">
                            <div className="success-icon">✅</div>
                            <p>Transaction completed successfully!</p>
                        </div>
                    </div>
                )}
            </div>

            {polling && (
                <div className="polling-indicator">
                    <PollingCountdownTimer isPolling={polling} />
                </div>
            )}

            <div className="status-actions">
                <button className="new-transaction-btn" onClick={resetTransaction}>
                    Start New Transaction
                </button>
            </div>
        </div>
    );
};