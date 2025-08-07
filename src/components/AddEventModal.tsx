"use client";

import { useState } from 'react';
import { NewEvent } from '@/types/event';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { DateTimePicker } from '@/components/ui/DateTimePicker';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: NewEvent) => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAddEvent }) => {
  const [formData, setFormData] = useState<NewEvent>({
    name: '',
    date: '',
    time: '',
    description: ''
  });
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !selectedDateTime) {
      toast.error('Please fill in all required fields (Name, Date, and Time)');
      return;
    }

    // Validate that the date/time is in the future
    const now = new Date();
    
    if (selectedDateTime <= now) {
      toast.error('Please select a future date and time');
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
    
    onClose();
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-modal-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center">
              <span className="text-cyan-400 text-xl">⚡</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">CREATE_EVENT</h2>
              <p className="text-sm text-cyan-400/70 font-mono">{`// Initialize new temporal anchor`}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
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
              onClick={onClose}
              className="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl font-mono font-bold hover:bg-red-500/30 transition-all"
            >
              [ABORT]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
