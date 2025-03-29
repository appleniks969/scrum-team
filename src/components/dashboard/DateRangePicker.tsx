import React, { useState } from 'react';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface DateRangePickerProps {
  onChange: (range: DateRange) => void;
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onChange, className = '' }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const presets = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'This sprint', value: 'sprint' },
    { label: 'Last sprint', value: 'last-sprint' },
    { label: 'This quarter', value: 'quarter' },
  ];

  const handlePresetClick = (preset: string) => {
    setActivePreset(preset);
    
    const today = new Date();
    let start = new Date();
    let end = today;
    
    switch (preset) {
      case '7d':
        start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        start = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        start = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'sprint':
        // Simplified: assuming 2-week sprints starting at the beginning of the month
        const currentDay = today.getDate();
        start = new Date(today.getFullYear(), today.getMonth(), currentDay <= 15 ? 1 : 16);
        end = new Date(today.getFullYear(), today.getMonth(), currentDay <= 15 ? 15 : today.getDate());
        break;
      case 'last-sprint':
        // Simplified: previous 2-week sprint
        const day = today.getDate();
        if (day <= 15) {
          // Previous month's second half
          start = new Date(today.getFullYear(), today.getMonth() - 1, 16);
          end = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of previous month
        } else {
          // Current month's first half
          start = new Date(today.getFullYear(), today.getMonth(), 1);
          end = new Date(today.getFullYear(), today.getMonth(), 15);
        }
        break;
      case 'quarter':
        // Current quarter
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        end = today;
        break;
      default:
        break;
    }
    
    const formattedStartDate = start.toISOString().split('T')[0];
    const formattedEndDate = end.toISOString().split('T')[0];
    
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    
    onChange({
      startDate: formattedStartDate,
      endDate: formattedEndDate
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, isStart: boolean) => {
    setActivePreset(null);
    
    const newDate = e.target.value;
    
    if (isStart) {
      setStartDate(newDate);
      
      if (endDate && newDate > endDate) {
        setEndDate(newDate);
      }
    } else {
      setEndDate(newDate);
    }
    
    if ((isStart && endDate) || (!isStart && startDate)) {
      onChange({
        startDate: isStart ? newDate : startDate,
        endDate: isStart ? endDate : newDate
      });
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2 mb-2">
        {presets.map(preset => (
          <button
            key={preset.value}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              activePreset === preset.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handlePresetClick(preset.value)}
          >
            {preset.label}
          </button>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange(e, true)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex-1">
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => handleDateChange(e, false)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
