import React, { useState } from 'react';
import type { PaymentScreenProps } from '../types';
import { pay } from '../services/api';
import { LoadingSpinner } from './common/LoadingSpinner';
import { ErrorMessage } from './common/ErrorMessage';
import { TransactionDetails } from './common/TransactionDetails';
import { useTransactionStore } from '../store/transactionStore';

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
    quote
}) => {
    const { setTransactionId, setStage, clearQuote } = useTransactionStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentCompleted, setPaymentCompleted] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            const paymentResult = await pay({ quoteId: quote.quoteId });
            setPaymentCompleted(true);
            setLoading(false);

            // Store transaction ID and navigate to status screen
            setTransactionId(paymentResult.transactionId);
            setStage('status');
        } catch (err) {
            setLoading(false);
            setError(err instanceof Error ? err.message : 'Payment failed');
        }
    };

    const handleBack = () => {
        if (!loading && !paymentCompleted) {
            // Clear quote and go back to quote screen
            clearQuote();
        }
    };

    return (
        <div className="payment-screen">
            <h1>Confirm Payment</h1>

            <div className="payment-summary">
                <h2>Payment Summary</h2>

                <TransactionDetails
                    sourceCurrency={quote.sourceCurrency}
                    destinationCurrency={quote.destinationCurrency}
                    amount={quote.amount}
                    rate={quote.rate}
                    fees={quote.fees}
                    totalPayable={quote.totalPayable}
                    className="summary-details"
                />
            </div>

            {error && (
                <ErrorMessage
                    message={error}
                    onRetry={handlePayment}
                />
            )}

            <div className="payment-actions">
                <button
                    className="back-btn"
                    onClick={handleBack}
                    disabled={loading || paymentCompleted}
                >
                    Back
                </button>

                <button
                    className="pay-btn"
                    onClick={handlePayment}
                    disabled={loading || paymentCompleted}
                >
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </div>

            {loading && <LoadingSpinner message="Processing your payment..." />}

            {paymentCompleted && (
                <div className="success-message">
                    <div className="success-icon">✅</div>
                    <p>Payment successful! Your transaction is being processed.</p>
                </div>
            )}
        </div>
    );
};