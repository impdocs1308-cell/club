
import React, { useState, useEffect } from 'react';

interface Props {
  targetDate: string;
  label: string;
}

const Countdown: React.FC<Props> = ({ targetDate, label }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        setTimeLeft(null);
        clearInterval(timer);
      } else {
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return (
    <div className="text-center py-6">
      <h3 className="text-blue-900 font-title text-3xl">Live Action Now!</h3>
    </div>
  );

  const Unit = ({ val, label }: { val: number, label: string }) => (
    <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm border border-blue-100 min-w-[70px]">
      <span className="text-3xl font-bold text-blue-700">{val}</span>
      <span className="text-[10px] uppercase text-blue-400 font-semibold">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4 py-8 bg-blue-50/50 rounded-2xl border border-blue-100 mb-8 px-4">
      <h3 className="text-blue-800 font-medium uppercase tracking-[0.2em] text-xs">{label}</h3>
      <div className="flex gap-4">
        <Unit val={timeLeft.d} label="Days" />
        <Unit val={timeLeft.h} label="Hours" />
        <Unit val={timeLeft.m} label="Mins" />
        <Unit val={timeLeft.s} label="Secs" />
      </div>
    </div>
  );
};

export default Countdown;
