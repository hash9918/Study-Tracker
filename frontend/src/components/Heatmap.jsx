import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { format, subDays, eachDayOfInterval } from 'date-fns';

const Heatmap = ({ refreshTrigger }) => {
  const [heatmapData, setHeatmapData] = useState({});
  const { apiUrl, token } = useContext(AuthContext);
  const scrollRef = useRef(null);

  const scrollToRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToRight();
  }, [heatmapData]);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const res = await fetch(`${apiUrl}/stats/heatmap`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setHeatmapData(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch heatmap', err);
      }
    };
    fetchHeatmap();
  }, [apiUrl, token, refreshTrigger]);

  // Generate last 90 days for the heatmap
  const today = new Date();
  const past90Days = eachDayOfInterval({
    start: subDays(today, 89),
    end: today
  });

  const getColorClass = (dateStr) => {
    const dayData = heatmapData[dateStr];
    if (!dayData) return 'bg-zinc-800'; // Empty
    if (dayData.ratio === 1) return 'bg-emerald-500'; // All done
    if (dayData.ratio >= 0.5) return 'bg-emerald-600/70'; // Half done
    return 'bg-emerald-700/40'; // Barely done
  };

  return (
    <div 
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg"
      onMouseLeave={scrollToRight}
    >
      <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-4">Consistency (Last 90 Days)</h3>
      <div 
        ref={scrollRef}
        className="overflow-x-hidden hover:overflow-x-auto transition-all custom-scrollbar pb-3"
      >
        <div className="grid grid-rows-2 grid-flow-col gap-1.5 min-w-max p-1 pr-4">
        {past90Days.map(date => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const displayDate = format(date, 'MMMM do, yyyy');
          return (
            <div 
              key={dateStr}
              title={`${displayDate}: ${heatmapData[dateStr] ? `${heatmapData[dateStr].completed}/${heatmapData[dateStr].total} completed` : 'No activity'}`}
              className={`w-3 h-3 rounded-sm ${getColorClass(dateStr)} transition-colors hover:ring-2 hover:ring-zinc-400`}
            />
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
