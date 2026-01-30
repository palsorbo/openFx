import React from 'react';
import type { CurrencyCode } from '../../types';
import { formatCurrency, formatRate } from '../../utils/formatters';

interface TransactionDetailsProps {
    sourceCurrency: CurrencyCode;
    destinationCurrency: CurrencyCode;
    amount: number;
    rate: number;
    fees: number;
    totalPayable: number;
    showMetadata?: boolean;
    createdAt?: number;
    updatedAt?: number;
    transactionId?: string;
    className?: string;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
    sourceCurrency,
    destinationCurrency,
    amount,
    rate,
    fees,
    totalPayable,
    showMetadata = false,
    createdAt,
    updatedAt,
    transactionId,
    className = ''
}) => {
    return (
        <div className={`transaction-details ${className}`}>
            <div className="detail-row">
                <span className="label">From:</span>
                <span className="value">{sourceCurrency}</span>
            </div>
            <div className="detail-row">
                <span className="label">To:</span>
                <span className="value">{destinationCurrency}</span>
            </div>
            <div className="detail-row">
                <span className="label">Exchange Rate:</span>
                <span className="value">{formatRate(rate)}</span>
            </div>
            <div className="detail-row">
                <span className="label">Amount:</span>
                <span className="value">{formatCurrency(amount, sourceCurrency)}</span>
            </div>
            <div className="detail-row">
                <span className="label">Fees:</span>
                <span className="value">{formatCurrency(fees, sourceCurrency)}</span>
            </div>
            <div className="detail-row total-row">
                <span className="label">Total Payable:</span>
                <span className="value total">{formatCurrency(totalPayable, sourceCurrency)}</span>
            </div>
            <div className="detail-row">
                <span className="label">You will receive:</span>
                <span className="value">{formatCurrency(amount * rate, destinationCurrency)}</span>
            </div>

            {showMetadata && (
                <>
                    {transactionId && (
                        <div className="detail-row">
                            <span className="label">Transaction ID:</span>
                            <span className="value">{transactionId}</span>
                        </div>
                    )}
                    {createdAt && (
                        <div className="detail-row">
                            <span className="label">Created:</span>
                            <span className="value">{new Date(createdAt).toLocaleString()}</span>
                        </div>
                    )}
                    {updatedAt && (
                        <div className="detail-row">
                            <span className="label">Last Updated:</span>
                            <span className="value">{new Date(updatedAt).toLocaleString()}</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};