import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import StreakCounter from '../components/StreakCounter';
import Heatmap from '../components/Heatmap';
import ScheduleBuilder from '../components/ScheduleBuilder';
import Clock from '../components/Clock';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="max-w-5xl mx-auto p-4 py-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Tracker
          </h1>
          <p className="text-zinc-400">Welcome back, {user?.username}!</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/history"
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium px-4 py-2"
          >
            View History
          </Link>
          <button
            onClick={logout}
            className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-1">
          <Clock />
        </div>
        <div className="md:col-span-1">
          <StreakCounter refreshTrigger={refreshTrigger} />
        </div>
        <div className="md:col-span-2">
          <Heatmap refreshTrigger={refreshTrigger} />
        </div>
      </div>

      <div className="mt-8">
        <ScheduleBuilder onUpdate={() => setRefreshTrigger(prev => prev + 1)} />
      </div>
    </div>
  );
};

export default Dashboard;
