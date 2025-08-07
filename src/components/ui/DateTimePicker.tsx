"use client";

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock } from 'lucide-react';

interface DateTimePickerProps {
  selectedDate?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  showTimeSelect?: boolean;
  dateFormat?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDate,
  onChange,
  placeholder = "Select date and time",
  minDate = new Date(),
  showTimeSelect = true,
  dateFormat = "MMM dd, yyyy h:mm aa",
  className = "",
  label,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const CustomInput = React.forwardRef<HTMLDivElement, any>(({ value, onClick }, ref) => (
    <div 
      ref={ref}
      onClick={onClick}
      className={`
        w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-xl text-white 
        focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 
        shadow-sm hover:border-cyan-500/50 transition-all font-mono cursor-pointer
        flex items-center gap-3 min-h-[48px]
        ${className}
      `}
    >
      <div className="flex items-center gap-2 flex-1">
        {showTimeSelect ? (
          <>
            <Calendar className="w-4 h-4 text-cyan-400" />
            <Clock className="w-4 h-4 text-cyan-400" />
          </>
        ) : (
          <Calendar className="w-4 h-4 text-cyan-400" />
        )}
        <span className={value ? "text-white" : "text-blue-400/50"}>
          {value || placeholder}
        </span>
      </div>
      <div className="text-cyan-400 text-sm">▼</div>
    </div>
  ));

  CustomInput.displayName = "CustomInput";

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-mono font-bold text-cyan-400 mb-3 uppercase tracking-wider">
          {label} {required && '*'}
        </label>
      )}
      
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        showTimeSelect={showTimeSelect}
        timeFormat="HH:mm"
        timeIntervals={1}
        dateFormat={dateFormat}
        minDate={minDate}
        customInput={<CustomInput />}
        open={isOpen}
        onInputClick={() => setIsOpen(true)}
        onClickOutside={() => setIsOpen(false)}
        calendarClassName="custom-datepicker"
        popperClassName="date-picker-popper"
        popperPlacement="bottom-start"
        showPopperArrow={false}
        fixedHeight
      />
      
      <style jsx global>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        
        .custom-datepicker {
          background-color: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 12px;
          backdrop-filter: blur(16px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          overflow: hidden;
          min-width: 320px !important;
          width: auto !important;
        }
        
        .react-datepicker__month-container {
          float: left;
          width: auto !important;
        }
        
        .react-datepicker__header {
          background-color: rgba(6, 182, 212, 0.1);
          border-bottom: 1px solid rgba(6, 182, 212, 0.2);
          border-radius: 0;
          padding: 12px 16px;
        }
        
        .react-datepicker__current-month {
          color: #06b6d4;
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 8px;
          text-align: center;
        }
        
        .react-datepicker__day-names {
          background-color: rgba(6, 182, 212, 0.05);
          padding: 8px 0;
          margin-bottom: 6px;
          display: flex;
          justify-content: space-around;
        }
        
        .react-datepicker__day-name {
          color: #06b6d4;
          font-weight: 600;
          font-size: 13px;
          width: 36px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .react-datepicker__month {
          margin: 0 12px 12px 12px;
          text-align: center;
        }
        
        .react-datepicker__week {
          display: flex;
          justify-content: space-around;
          margin-bottom: 4px;
        }
        
        .react-datepicker__day {
          color: #e2e8f0;
          border-radius: 6px;
          transition: all 0.2s;
          font-weight: 500;
          width: 36px;
          height: 36px;
          line-height: 36px;
          margin: 0;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .react-datepicker__day:hover {
          background-color: rgba(6, 182, 212, 0.2) !important;
          color: #06b6d4 !important;
          transform: scale(1.05);
        }
        
        .react-datepicker__day--selected {
          background-color: rgba(6, 182, 212, 0.4) !important;
          color: #06b6d4 !important;
          border: 2px solid rgba(6, 182, 212, 0.6) !important;
          font-weight: 700;
        }
        
        .react-datepicker__day--today {
          background-color: rgba(59, 130, 246, 0.3) !important;
          color: #3b82f6 !important;
          border: 2px solid rgba(59, 130, 246, 0.5) !important;
          font-weight: 600;
        }
        
        .react-datepicker__day--disabled {
          color: #64748b !important;
          cursor: not-allowed !important;
          opacity: 0.5;
        }
        
        .react-datepicker__day--disabled:hover {
          background-color: transparent !important;
          transform: none !important;
        }
        
        .react-datepicker__navigation {
          border: none;
          background: none;
          color: #06b6d4;
          width: 30px;
          height: 30px;
          top: 16px;
          font-size: 18px;
        }
        
        .react-datepicker__navigation:hover {
          background-color: rgba(6, 182, 212, 0.1);
          border-radius: 8px;
        }
        
        .react-datepicker__navigation--previous {
          left: 16px;
        }
        
        .react-datepicker__navigation--next {
          right: 16px;
        }
        
        .react-datepicker__time-container {
          border-left: 1px solid rgba(6, 182, 212, 0.2);
          background-color: rgba(15, 23, 42, 0.95);
          width: 110px;
          min-width: 110px;
        }
        
        .react-datepicker__time {
          background: rgba(15, 23, 42, 0.95);
          border-radius: 0;
        }
        
        .react-datepicker__time-box {
          width: 110px;
        }
        
        .react-datepicker__time-list {
          background-color: rgba(15, 23, 42, 0.95);
          scrollbar-width: thin;
          scrollbar-color: rgba(6, 182, 212, 0.3) transparent;
          height: 180px !important;
        }
        
        .react-datepicker__time-list::-webkit-scrollbar {
          width: 8px;
        }
        
        .react-datepicker__time-list::-webkit-scrollbar-track {
          background: rgba(6, 182, 212, 0.1);
          border-radius: 4px;
        }
        
        .react-datepicker__time-list::-webkit-scrollbar-thumb {
          background-color: rgba(6, 182, 212, 0.4);
          border-radius: 4px;
        }
        
        .react-datepicker__time-list::-webkit-scrollbar-thumb:hover {
          background-color: rgba(6, 182, 212, 0.6);
        }
        
        .react-datepicker__time-list-item {
          color: #e2e8f0;
          transition: all 0.2s;
          padding: 6px 12px;
          font-size: 13px;
          border-radius: 4px;
          margin: 1px 3px;
        }
        
        .react-datepicker__time-list-item:hover {
          background-color: rgba(6, 182, 212, 0.2) !important;
          color: #06b6d4 !important;
        }
        
        .react-datepicker__time-list-item--selected {
          background-color: rgba(6, 182, 212, 0.3) !important;
          color: #06b6d4 !important;
          font-weight: 600;
        }
        
        .react-datepicker__header__dropdown {
          background-color: rgba(15, 23, 42, 0.95);
        }
        
        .react-datepicker__month-dropdown,
        .react-datepicker__year-dropdown {
          background-color: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 8px;
          color: #e2e8f0;
        }
        
        .react-datepicker__month-option,
        .react-datepicker__year-option {
          color: #e2e8f0;
          padding: 8px 12px;
        }
        
        .react-datepicker__month-option:hover,
        .react-datepicker__year-option:hover {
          background-color: rgba(6, 182, 212, 0.1);
          color: #06b6d4;
        }
        
        .react-datepicker__month-option--selected_month,
        .react-datepicker__year-option--selected_year {
          background-color: rgba(6, 182, 212, 0.2);
          color: #06b6d4;
        }
        
        .date-picker-popper {
          z-index: 1000;
        }
        
        .react-datepicker-popper[data-placement^="bottom"] {
          margin-top: 8px;
        }
        
        .react-datepicker-popper[data-placement^="top"] {
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};
