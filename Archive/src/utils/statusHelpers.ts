import type { TransactionStatus } from '../types';

export const getStatusColor = (status: TransactionStatus): string => {
    switch (status) {
        case 'processing': return '#f39c12';
        case 'sent': return '#3498db';
        case 'settled': return '#27ae60';
        case 'failed': return '#e74c3c';
        default: return '#95a5a6';
    }
};

export const getStatusText = (status: TransactionStatus): string => {
    switch (status) {
        case 'processing': return 'Processing';
        case 'sent': return 'Sent';
        case 'settled': return 'Settled';
        case 'failed': return 'Failed';
        default: return 'Unknown';
    }
};