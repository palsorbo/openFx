import type {
    QuoteRequest,
    QuoteResponse,
    PaymentRequest,
    PaymentResponse,
    Transaction
} from '../types';
import { generateId, isQuoteExpired } from '../utils/formatters';
import { CURRENCY_CODES } from '../constants/currencies';
import { BASE_RATES, RATE_FLUCTUATION_RANGE } from '../constants/rates';
import { FEE_RATE, MINIMUM_FEE } from '../constants/fees';
import {
    QUOTE_API_DELAY,
    PAYMENT_API_DELAY,
    STATUS_API_DELAY,
    QUOTE_EXPIRY_TIME
} from '../constants/timeouts';
import {
    QUOTE_FAILURE_RATE,
    PAYMENT_FAILURE_RATE,
    STATUS_FAILURE_RATE
} from '../constants/failureRates';

// In-memory storage for quotes and transactions
let quotes: Map<string, QuoteResponse> = new Map();
let transactions: Map<string, Transaction> = new Map();

// Helper to add random fluctuation to rates
const getFluctuatedRate = (baseRate: number): number => {
    const fluctuation = (Math.random() - 0.5) * RATE_FLUCTUATION_RANGE; // ±1% fluctuation
    return baseRate * (1 + fluctuation);
};

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to simulate random failures
const maybeFail = (failureRate: number): void => {
    if (Math.random() < failureRate) {
        throw new Error('Network error: Request failed');
    }
};

export const getQuote = async (request: QuoteRequest): Promise<QuoteResponse> => {
    await delay(QUOTE_API_DELAY); // Simulate network delay
    maybeFail(QUOTE_FAILURE_RATE); // 5% failure rate for quotes


    const { sourceCurrency, destinationCurrency, amount } = request;

    // Validate currencies
    if (!CURRENCY_CODES.includes(sourceCurrency) || !CURRENCY_CODES.includes(destinationCurrency)) {
        throw new Error('Invalid currency pair');
    }

    if (sourceCurrency === destinationCurrency) {
        throw new Error('Source and destination currencies must be different');
    }

    if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
    }

    // Get base rate and apply fluctuation
    const rateKey = `${sourceCurrency}-${destinationCurrency}`;
    const baseRate = BASE_RATES[rateKey];

    if (!baseRate) {
        throw new Error('Unsupported currency pair');
    }

    const rate = getFluctuatedRate(baseRate);

    // Calculate fees (1% of amount, minimum $5)
    const fees = Math.max(amount * FEE_RATE, MINIMUM_FEE);
    const totalPayable = amount + fees;

    // Create quote
    const quoteId = generateId();
    const expiryTime = Date.now() + QUOTE_EXPIRY_TIME; // 30 seconds expiry

    const quote: QuoteResponse = {
        quoteId,
        rate,
        fees,
        totalPayable,
        expiryTime,
        sourceCurrency,
        destinationCurrency,
        amount
    };

    // Store quote
    quotes.set(quoteId, quote);

    return quote;
};

export const pay = async (request: PaymentRequest): Promise<PaymentResponse> => {
    await delay(PAYMENT_API_DELAY); // Simulate payment processing delay
    maybeFail(PAYMENT_FAILURE_RATE); // 10% failure rate for payments

    const { quoteId } = request;

    // Check if quote exists and is valid
    const quote = quotes.get(quoteId);
    if (!quote) {
        throw new Error('Invalid quote ID');
    }

    if (isQuoteExpired(quote.expiryTime)) {
        throw new Error('Quote has expired');
    }

    // Check if already paid (prevent double payment)
    const existingTransaction = Array.from(transactions.values())
        .find(t => t.quoteId === quoteId);

    if (existingTransaction) {
        throw new Error('Payment already processed');
    }

    // Create transaction
    const transactionId = generateId();
    const now = Date.now();

    const transaction: Transaction = {
        transactionId,
        status: 'processing',
        createdAt: now,
        updatedAt: now,
        quoteId,
        sourceCurrency: quote.sourceCurrency,
        destinationCurrency: quote.destinationCurrency,
        amount: quote.amount,
        rate: quote.rate,
        fees: quote.fees,
        totalPayable: quote.totalPayable
    };

    transactions.set(transactionId, transaction);

    return {
        transactionId,
        quoteId
    };
};

export const getTransaction = async (transactionId: string): Promise<Transaction> => {
    await delay(STATUS_API_DELAY); // Simulate API delay
    maybeFail(STATUS_FAILURE_RATE); // 2% failure rate for status checks

    const transaction = transactions.get(transactionId);

    if (!transaction) {
        throw new Error('Transaction not found');
    }

    return transaction;
};

// Admin functions for testing
export const getQuotes = (): QuoteResponse[] => {
    return Array.from(quotes.values());
};

export const getTransactions = (): Transaction[] => {
    return Array.from(transactions.values());
};

export const updateTransactionStatus = (transactionId: string, status: 'processing' | 'sent' | 'settled' | 'failed'): void => {
    const transaction = transactions.get(transactionId);
    if (transaction) {
        transaction.status = status;
        transaction.updatedAt = Date.now();
    }
};