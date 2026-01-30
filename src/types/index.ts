// Currency types
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR';

export interface Currency {
    code: CurrencyCode;
    name: string;
    symbol: string;
}

// Quote types
export interface QuoteRequest {
    sourceCurrency: CurrencyCode;
    destinationCurrency: CurrencyCode;
    amount: number;
}

export interface QuoteResponse {
    quoteId: string;
    rate: number;
    fees: number;
    totalPayable: number;
    expiryTime: number; // Unix timestamp in milliseconds
    sourceCurrency: CurrencyCode;
    destinationCurrency: CurrencyCode;
    amount: number;
}

// Payment types
export interface PaymentRequest {
    quoteId: string;
}

export interface PaymentResponse {
    transactionId: string;
    quoteId: string;
}

// Transaction status types
export type TransactionStatus = 'processing' | 'sent' | 'settled' | 'failed';

export interface Transaction {
    transactionId: string;
    status: TransactionStatus;
    createdAt: number;
    updatedAt: number;
    quoteId: string;
    sourceCurrency: CurrencyCode;
    destinationCurrency: CurrencyCode;
    amount: number;
    rate: number;
    fees: number;
    totalPayable: number;
}

// Error types
export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

// Component props types
export interface QuoteScreenProps {
}

export interface PaymentScreenProps {
    quote: QuoteResponse;
}

export interface StatusScreenProps {
    transactionId: string;
}
