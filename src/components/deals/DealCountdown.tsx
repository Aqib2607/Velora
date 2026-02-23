import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface DealCountdownProps {
    endTimeISO: string;
}

const DealCountdown = ({ endTimeISO }: DealCountdownProps) => {
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(endTimeISO).getTime() - new Date().getTime();

            if (difference > 0) {
                setTimeLeft({
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft(null); // Deal expired
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [endTimeISO]);

    if (!timeLeft) {
        return (
            <div className="flex items-center gap-1 text-sm text-red-500 font-semibold bg-red-50 px-2 py-1 rounded-md mb-2">
                <Clock className="w-4 h-4" />
                <span>Deal Expired</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6a329f] bg-[#6a329f]/10 px-2 py-1 rounded-md mb-2 w-fit border border-[#6a329f]/20 shadow-sm">
            <Clock className="w-3.5 h-3.5" />
            <span>Ends in</span>
            <span className="font-mono bg-white px-1 rounded text-[#6a329f]">
                {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            :
            <span className="font-mono bg-white px-1 rounded text-[#6a329f]">
                {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            :
            <span className="font-mono bg-white px-1 rounded text-[#6a329f]">
                {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
        </div>
    );
};

export default DealCountdown;
