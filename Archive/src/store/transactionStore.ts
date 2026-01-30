import { create } from 'zustand';
import type { QuoteResponse, TransactionStatus } from '../types';

type AppStage = 'quote' | 'payment' | 'status';

interface TransactionState {
    // State
    stage: AppStage;
    quote: QuoteResponse | null;
    transactionId: string | null;

    // Actions
    setStage: (stage: AppStage) => void;
    setQuote: (quote: QuoteResponse) => void;
    setTransactionId: (transactionId: string) => void;
    resetTransaction: () => void;
    clearQuote: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
    // Initial state
    stage: 'quote',
    quote: null,
    transactionId: null,

    // Actions
    setStage: (stage) => set({ stage }),
    setQuote: (quote) => set({ quote }),
    setTransactionId: (transactionId) => set({ transactionId }),
    resetTransaction: () => set({
        stage: 'quote',
        quote: null,
        transactionId: null,
    }),
    clearQuote: () => set({
        stage: 'quote',
        quote: null,
    }),
}));