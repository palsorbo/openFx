import { getStatusColor, getStatusText } from '../statusHelpers';

describe('statusHelpers', () => {
    describe('getStatusColor', () => {
        it('should return correct color for processing status', () => {
            expect(getStatusColor('processing')).toBe('#f39c12');
        });

        it('should return correct color for sent status', () => {
            expect(getStatusColor('sent')).toBe('#3498db');
        });

        it('should return correct color for settled status', () => {
            expect(getStatusColor('settled')).toBe('#27ae60');
        });

        it('should return correct color for failed status', () => {
            expect(getStatusColor('failed')).toBe('#e74c3c');
        });

        it('should return default color for unknown status', () => {
            expect(getStatusColor('unknown' as any)).toBe('#95a5a6');
        });
    });

    describe('getStatusText', () => {
        it('should return correct text for processing status', () => {
            expect(getStatusText('processing')).toBe('Processing');
        });

        it('should return correct text for sent status', () => {
            expect(getStatusText('sent')).toBe('Sent');
        });

        it('should return correct text for settled status', () => {
            expect(getStatusText('settled')).toBe('Settled');
        });

        it('should return correct text for failed status', () => {
            expect(getStatusText('failed')).toBe('Failed');
        });

        it('should return default text for unknown status', () => {
            expect(getStatusText('unknown' as any)).toBe('Unknown');
        });
    });
});