import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Plus, Check, Trash2, Edit2, Save } from 'lucide-react';
import { format } from 'date-fns';

const ScheduleBuilder = ({ onUpdate }) => {
  const [blocks, setBlocks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('10:00');
  const [editingIndex, setEditingIndex] = useState(null);
  
  const { apiUrl, token } = useContext(AuthContext);
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const addMinutes = (timeStr, mins) => {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m + mins, 0, 0);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`${apiUrl}/schedule/${todayStr}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBlocks(data.blocks || []);
        }
      } catch (err) {
        console.error('Failed to fetch schedule', err);
      }
    };
    fetchSchedule();
  }, [apiUrl, token, todayStr]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle) return;

    let updatedBlocks = [...blocks];

    if (editingIndex !== null) {
      updatedBlocks[editingIndex] = {
        ...updatedBlocks[editingIndex],
        title: newTitle,
        startTime: newStartTime,
        endTime: newEndTime
      };
      setEditingIndex(null);
    } else {
      const newBlock = { title: newTitle, startTime: newStartTime, endTime: newEndTime, isCompleted: false };
      updatedBlocks.push(newBlock);
      
      const nextStart = addMinutes(newEndTime, 5);
      // Determine previous block duration to carry it over
      const [startH, startM] = newStartTime.split(':').map(Number);
      const [endH, endM] = newEndTime.split(':').map(Number);
      const durationMins = (endH * 60 + endM) - (startH * 60 + startM);
      const nextEnd = addMinutes(nextStart, durationMins > 0 ? durationMins : 60);
      
      setNewStartTime(nextStart);
      setNewEndTime(nextEnd);
    }

    updatedBlocks.sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    setBlocks(updatedBlocks);
    setNewTitle('');

    // Save to backend
    const res = await fetch(`${apiUrl}/schedule/${todayStr}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ blocks: updatedBlocks })
    });
    if (res.ok) {
      const data = await res.json();
      setBlocks(data.blocks);
    }
    if (onUpdate) onUpdate();
  };

  const editBlock = (idx) => {
    const block = blocks[idx];
    setNewTitle(block.title);
    setNewStartTime(block.startTime);
    setNewEndTime(block.endTime);
    setEditingIndex(idx);
  };

  const toggleComplete = async (blockId, currentStatus) => {
    const updatedBlocks = blocks.map(b => b._id === blockId ? { ...b, isCompleted: !currentStatus } : b);
    setBlocks(updatedBlocks); // Optimistic UI update

    await fetch(`${apiUrl}/schedule/${todayStr}/block/${blockId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ isCompleted: !currentStatus })
    });
    if (onUpdate) onUpdate();
  };

  const removeBlock = async (indexToRemove) => {
    const updatedBlocks = blocks.filter((_, idx) => idx !== indexToRemove);
    setBlocks(updatedBlocks); // optimistic
    const res = await fetch(`${apiUrl}/schedule/${todayStr}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ blocks: updatedBlocks })
    });
    if (res.ok) {
      const data = await res.json();
      setBlocks(data.blocks);
    }
    if (onUpdate) onUpdate();
    if (editingIndex === indexToRemove) {
      setEditingIndex(null);
      setNewTitle('');
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-6 text-white">Today's Schedule</h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input 
          type="time" 
          value={newStartTime} 
          onChange={e => setNewStartTime(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
          required
        />
        <input 
          type="time" 
          value={newEndTime} 
          onChange={e => setNewEndTime(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
          required
        />
        <input 
          type="text" 
          placeholder="What are you studying?" 
          value={newTitle} 
          onChange={e => setNewTitle(e.target.value)}
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
          required
        />
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg flex items-center justify-center transition-colors">
          {editingIndex !== null ? <Save size={24} /> : <Plus size={24} />}
        </button>
      </form>

      <div className="space-y-3">
        {blocks.length === 0 ? (
          <p className="text-zinc-500 text-center py-4">No blocks planned for today yet.</p>
        ) : (
          blocks.map((block, idx) => (
            <div 
              key={block._id || idx} 
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                block.isCompleted 
                  ? 'bg-zinc-800/50 border-zinc-700/50' 
                  : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'
              } ${editingIndex === idx ? 'ring-2 ring-indigo-500 border-transparent' : ''}`}
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => block._id && toggleComplete(block._id, block.isCompleted)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    block.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-500 hover:border-emerald-400'
                  }`}
                >
                  {block.isCompleted && <Check size={14} strokeWidth={3} />}
                </button>
                <div>
                  <p className={`font-medium ${block.isCompleted ? 'text-zinc-500 line-through' : 'text-white'}`}>
                    {block.title}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {block.startTime} - {block.endTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => editBlock(idx)} 
                  className={`transition-colors ${editingIndex === idx ? 'text-indigo-400' : 'text-zinc-500 hover:text-indigo-400'}`}
                  title="Edit block"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => removeBlock(idx)} 
                  className="text-zinc-500 hover:text-red-400 transition-colors"
                  title="Delete block"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduleBuilder;
