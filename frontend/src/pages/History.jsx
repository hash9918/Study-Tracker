import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { format } from 'date-fns';

const History = () => {
  const [schedules, setSchedules] = useState([]);
  const { apiUrl, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${apiUrl}/schedule/history/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSchedules(data);
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      }
    };
    fetchHistory();
  }, [apiUrl, token]);

  return (
    <div className="max-w-5xl mx-auto p-4 py-8">
      <header className="flex items-center gap-4 mb-10">
        <Link to="/" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-white">Your History</h1>
      </header>

      <div className="space-y-6">
        {schedules.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg text-center text-zinc-400">
            No past schedules found. Start building your tracker today!
          </div>
        ) : (
          schedules.map((schedule) => {
            const [year, month, day] = schedule.date.split('-');
            const dateObj = new Date(year, month - 1, day);
            const displayDate = format(dateObj, 'EEEE, MMMM do, yyyy');

            return (
              <div key={schedule._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-indigo-400 mb-4">{displayDate}</h2>
                {schedule.blocks.length === 0 ? (
                <p className="text-zinc-500 text-sm">No tasks were added for this day.</p>
              ) : (
                <div className="space-y-3">
                  {schedule.blocks.map(block => (
                    <div 
                      key={block._id}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                    >
                      <div>
                        <p className={`font-medium ${block.isCompleted ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                          {block.title}
                        </p>
                        <p className="text-sm text-zinc-500">
                          {block.startTime} - {block.endTime}
                        </p>
                      </div>
                      <div className={`p-2 rounded-full ${block.isCompleted ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                        {block.isCompleted ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default History;
