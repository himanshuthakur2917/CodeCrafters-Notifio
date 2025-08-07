"use client";

import { useState } from 'react';
import { NewEvent } from '@/types/event';
import { DateTimePicker } from '@/components/ui/DateTimePicker';

interface AddEventFormProps {
  onAddEvent: (event: NewEvent) => void;
}

export const AddEventForm: React.FC<AddEventFormProps> = ({ onAddEvent }) => {
  const [formData, setFormData] = useState<NewEvent>({
    name: '',
    date: '',
    time: '',
    description: ''
  });
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !selectedDateTime) {
      alert('Please fill in all required fields (Name, Date, and Time)');
      return;
    }

    // Validate that the date/time is in the future
    const now = new Date();
    
    if (selectedDateTime <= now) {
      alert('Please select a future date and time');
      return;
    }

    // Convert selectedDateTime to separate date and time strings
    const dateStr = selectedDateTime.toISOString().split('T')[0];
    const timeStr = selectedDateTime.toTimeString().slice(0, 5);
    
    const eventData = {
      ...formData,
      date: dateStr,
      time: timeStr
    };

    onAddEvent(eventData);
    
    // Reset form
    setFormData({
      name: '',
      date: '',
      time: '',
      description: ''
    });
    setSelectedDateTime(null);
    
    setIsFormVisible(false);
    
    // Show success message
    alert('Event added successfully!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateTimeChange = (date: Date | null) => {
    setSelectedDateTime(date);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center">
            <span className="text-cyan-400 text-xl">⚡</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-mono">CREATE_EVENT</h2>
            <p className="text-sm text-cyan-400/70 font-mono">// Initialize new temporal anchor</p>
          </div>
        </div>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className={`px-6 py-3 rounded-xl font-mono font-bold text-sm transition-all transform hover:scale-105 ${
            isFormVisible 
              ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
              : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 shadow-lg shadow-cyan-500/25'
          }`}
        >
          {isFormVisible ? '[ABORT]' : '[INITIALIZE]'}
        </button>
      </div>

      {isFormVisible && (
        <div className="animate-slide-in border-t border-cyan-500/20 pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-mono font-bold text-cyan-400 mb-3 uppercase tracking-wider">
                [NAME_INPUT] *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="> Enter event designation..."
                className="w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-xl text-white placeholder-blue-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 shadow-sm hover:border-cyan-500/50 transition-all font-mono"
                required
              />
            </div>

            <div>
              <DateTimePicker
                label="[TEMPORAL_COORDINATES]"
                selectedDate={selectedDateTime}
                onChange={handleDateTimeChange}
                placeholder="> Select event date and time..."
                showTimeSelect={true}
                dateFormat="MMM dd, yyyy 'at' h:mm aa"
                required={true}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-mono font-bold text-cyan-400 mb-3 uppercase tracking-wider">
                [DESCRIPTION_LOG] (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="> Additional context data..."
                rows={3}
                className="w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-xl text-white placeholder-blue-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 shadow-sm hover:border-cyan-500/50 transition-all resize-none font-mono"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 rounded-xl font-mono font-bold hover:from-cyan-500/30 hover:to-blue-500/30 transform hover:scale-105 transition-all shadow-lg hover:shadow-cyan-500/25"
              >
                [EXECUTE] ⚡
              </button>
              <button
                type="button"
                onClick={() => setIsFormVisible(false)}
                className="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl font-mono font-bold hover:bg-red-500/30 transition-all"
              >
                [ABORT]
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
