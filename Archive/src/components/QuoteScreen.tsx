import React, {
    useState,
    useCallback,
    useEffect,
    useMemo,
} from 'react';
import type { CurrencyCode, QuoteResponse } from '../types';
import { getQuote } from '../services/api';
import { CountdownTimer } from './common/CountdownTimer';
import { LoadingSpinner } from './common/LoadingSpinner';
import { ErrorMessage } from './common/ErrorMessage';
import { TransactionDetails } from './common/TransactionDetails';
import { getAvailableCurrencies } from '../utils/currencyHelpers';
import { useTransactionStore } from '../store/transactionStore';

type LoadingState = 'idle' | 'loading' | 'refreshing';

export const QuoteScreen: React.FC = () => {
    const { setQuote: setStoreQuote, setStage } = useTransactionStore();
    const [sourceCurrency, setSourceCurrency] = useState<CurrencyCode>('USD');
    const [destinationCurrency, setDestinationCurrency] = useState<CurrencyCode>('EUR');
    const [amount, setAmount] = useState('100');

    const [quote, setLocalQuote] = useState<QuoteResponse | null>(null);
    const [loadingState, setLoadingState] = useState<LoadingState>('idle');
    const [error, setError] = useState<string | null>(null);

    const [hasExpired, setHasExpired] = useState(false);

    const isLoading = loadingState === 'loading';
    const isRefreshing = loadingState === 'refreshing';

    const availableSourceCurrencies = getAvailableCurrencies(destinationCurrency);
    const availableDestinationCurrencies = getAvailableCurrencies(sourceCurrency);

    const isTimeExpired = useMemo(() => {
        return !!quote?.expiryTime && quote.expiryTime <= Date.now();
    }, [quote]);

    const expired = hasExpired || isTimeExpired;

    const fetchQuote = useCallback(
        async (mode: LoadingState) => {
            if (!amount || Number(amount) <= 0) {
                setError('Please enter a valid amount');
                return;
            }

            setLoadingState(mode);
            setError(null);

            try {
                const data = await getQuote({
                    sourceCurrency,
                    destinationCurrency,
                    amount: Number(amount),
                });

                setLocalQuote(data);
                setHasExpired(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to get quote');
            } finally {
                setLoadingState('idle');
            }
        },
        [amount, sourceCurrency, destinationCurrency]
    );

    const handleGetQuote = () => fetchQuote('loading');
    const handleRefreshQuote = () => quote && fetchQuote('refreshing');

    const handleConfirmQuote = () => {
        if (!quote) return;

        if (expired) {
            setError('Quote has expired. Please refresh to get a new quote.');
            return;
        }

        // Store the quote in the global store and navigate to payment screen
        setStoreQuote(quote);
        setStage('payment');
    };

    useEffect(() => {
        setLocalQuote(null);
        setError(null);
        setHasExpired(false);
    }, [sourceCurrency, destinationCurrency]);

    return (
        <div className="quote-screen">
            <h1>Get FX Quote</h1>

            <div className="form-group">
                <label htmlFor="source-currency">From</label>
                <select
                    id="source-currency"
                    value={sourceCurrency}
                    onChange={(e) => setSourceCurrency(e.target.value as CurrencyCode)}
                    disabled={isLoading}
                >
                    {availableSourceCurrencies.map((c) => (
                        <option key={c.code} value={c.code}>
                            {c.name} ({c.code})
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="destination-currency">To</label>
                <select
                    id="destination-currency"
                    value={destinationCurrency}
                    onChange={(e) =>
                        setDestinationCurrency(e.target.value as CurrencyCode)
                    }
                    disabled={isLoading}
                >
                    {availableDestinationCurrencies.map((c) => (
                        <option key={c.code} value={c.code}>
                            {c.name} ({c.code})
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    disabled={isLoading}
                />
            </div>

            <button onClick={handleGetQuote} disabled={isLoading}>
                {isLoading ? 'Getting Quote...' : 'Get Quote'}
            </button>

            {isLoading && <LoadingSpinner message="Calculating your quote..." />}

            {error && (
                <ErrorMessage
                    message={error}
                    onRetry={error.includes('expired') ? undefined : handleGetQuote}
                />
            )}

            {quote && (
                <div className={`quote-result ${expired ? 'expired' : ''}`}>
                    <h2>Quote Details</h2>

                    <CountdownTimer
                        expiryTime={quote.expiryTime}
                        onTimeUpdate={setHasExpired}
                    />

                    {expired && (
                        <div className="quote-expired-inline">
                            <p>This quote has expired. Please refresh to continue.</p>
                        </div>
                    )}

                    <TransactionDetails
                        sourceCurrency={quote.sourceCurrency}
                        destinationCurrency={quote.destinationCurrency}
                        amount={quote.amount}
                        rate={quote.rate}
                        fees={quote.fees}
                        totalPayable={quote.totalPayable}
                        className="quote-details"
                    />

                    <div className="quote-actions">
                        <button
                            className="refresh-btn"
                            onClick={handleRefreshQuote}
                            disabled={isRefreshing}
                        >
                            {isRefreshing ? 'Refreshing...' : 'Refresh Quote'}
                        </button>

                        <button
                            className="confirm-btn"
                            onClick={handleConfirmQuote}
                            disabled={expired || isRefreshing}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
