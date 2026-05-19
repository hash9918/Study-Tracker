import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col justify-center h-full relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1 z-10">
        {format(time, 'EEEE')}
      </p>
      <div className="z-10">
        <h2 className="text-3xl font-bold text-white tabular-nums tracking-tight">
          {format(time, 'h:mm')}
          <span className="text-xl text-indigo-400 ml-1">{format(time, 'a')}</span>
        </h2>
        <p className="text-zinc-500 text-sm mt-1">
          {format(time, 'MMMM do, yyyy')}
        </p>
      </div>
    </div>
  );
};

export default Clock;
