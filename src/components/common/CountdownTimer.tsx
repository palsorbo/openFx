import React, { useEffect, useState } from 'react';
import { formatTimeRemaining } from '../../utils/formatters';

interface CountdownTimerProps {
    expiryTime: number;
    onExpired?: () => void;
    onTimeUpdate?: (isExpired: boolean) => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
    expiryTime,
    onExpired,
    onTimeUpdate
}) => {
    const [timeRemaining, setTimeRemaining] = useState(() =>
        formatTimeRemaining(expiryTime)
    );

    useEffect(() => {
        const updateTimer = () => {
            const remaining = formatTimeRemaining(expiryTime);
            setTimeRemaining(remaining);

            const isExpired = remaining === 'Expired';
            if (isExpired) {
                onExpired?.();
            }

            // Call onTimeUpdate with current expired state
            onTimeUpdate?.(isExpired);
        };

        // Update immediately
        updateTimer();

        // Update every second
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [expiryTime, onExpired, onTimeUpdate]);

    const isExpired = timeRemaining === 'Expired';
    const isWarning = !isExpired && parseInt(timeRemaining.split(':')[0]) <= 1;

    return (
        <div className={`countdown-timer ${isExpired ? 'expired' : ''} ${isWarning ? 'warning' : ''}`}>
            <span className="label">Quote expires in:</span>
            <span className="time">{timeRemaining}</span>
        </div>
    );
};