import React, { useEffect, useState } from 'react';

interface PollingCountdownTimerProps {
    isPolling: boolean;
}

export const PollingCountdownTimer: React.FC<PollingCountdownTimerProps> = ({
    isPolling
}) => {
    const [countdown, setCountdown] = useState<string>('3s');

    useEffect(() => {
        if (!isPolling) {
            setCountdown('3s');
            return;
        }

        let timer: number;
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

        // Initial update
        updateCountdown();

        // Update every second
        timer = setInterval(updateCountdown, 1000) as unknown as number;

        return () => clearInterval(timer);
    }, [isPolling]);

    if (!isPolling) {
        return null;
    }

    return <span>{countdown}</span>;
};