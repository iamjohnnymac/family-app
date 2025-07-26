import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CustodyCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(6); // July = 6 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate custody based on alternating weeks starting July 25, 2025
  const getCustodyStatus = (date) => {
    const startDate = new Date(2025, 6, 25); // July 25, 2025 (bec has kids)
    const targetDate = new Date(2025, date.month, date.day);
    
    if (targetDate < startDate) return null;
    
    const daysDiff = Math.floor((targetDate - startDate) / (1000 * 60 * 60 * 24));
    const weeksDiff = Math.floor(daysDiff / 7);
    
    // Even weeks = bec has kids, odd weeks = ex-partner has kids
    return weeksDiff % 2 === 0 ? 'bec' : 'ex-partner';
  };

  const getWorkStatus = (date) => {
    const targetDate = new Date(2025, date.month, date.day);
    
    const awayStart = new Date(2025, 6, 25);
    const awayEnd = new Date(2025, 7, 13);
    
    const offStart = new Date(2025, 7, 14);
    const offEnd = new Date(2025, 8, 24);
    
    const rosterStart = new Date(2025, 8, 25);
    
    // Handle special takeoff/landing dates first
    if (date.month === 6 && date.day === 25) return 'takeoff'; // July 25
    if (date.month === 7 && date.day === 13) return 'landing'; // August 13
    if (date.month === 8 && date.day === 24) return 'takeoff'; // September 24
    
    if (targetDate >= awayStart && targetDate <= awayEnd) {
      return 'away';
    }
    
    if (targetDate >= offStart && targetDate <= offEnd) {
      return 'off';
    }
    
    if (targetDate >= rosterStart) {
      const daysSinceRosterStart = Math.floor((targetDate - rosterStart) / (1000 * 60 * 60 * 24));
      const weeksSinceRosterStart = Math.floor(daysSinceRosterStart / 7);
      
      const cyclePosition = weeksSinceRosterStart % 4;
      if (cyclePosition < 2) {
        // Flying out dates (Wednesdays)
        if ((date.month === 9 && date.day === 22) ||
            (date.month === 10 && date.day === 19) ||
            (date.month === 11 && date.day === 17)) {
          return 'takeoff';
        }
        
        // Flying home dates (Wednesdays)
        if ((date.month === 9 && date.day === 8) ||
            (date.month === 10 && date.day === 5) ||
            (date.month === 11 && date.day === 3) ||
            (date.month === 11 && date.day === 31)) {
          return 'landing';
        }
        
        return 'work';
      } else {
        return 'off';
      }
    }
    
    return 'off';
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, custody: null, work: null });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const custody = getCustodyStatus({ month: currentMonth, day });
      const work = getWorkStatus({ month: currentMonth, day });
      days.push({ day, custody, work });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const getCustodyIcon = (custody) => {
    if (custody === 'bec') return '👧👧';
    if (custody === 'ex-partner') return '🏠';
    return '';
  };

  const getWorkIcon = (work) => {
    if (work === 'takeoff') return '🛫';
    if (work === 'landing') return '🛬';
    if (work === 'away' || work === 'work') return '✈️';
    return '';
  };

  const getCustodyClass = (custody) => {
    if (custody === 'bec') return 'bg-gradient-to-br from-pink-100 to-pink-200 border-pink-400 text-pink-800 shadow-md';
    if (custody === 'ex-partner') return 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400 text-blue-800 shadow-md';
    return 'bg-gray-50 border-gray-200';
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-2 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 sm:p-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-center mb-6">Where Are The Girls</h1>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-sm sm:text-base">
              <div className="flex items-center space-x-3 bg-white/20 px-4 py-3 rounded-full min-w-fit">
                <span className="text-lg sm:text-2xl">👧👧</span>
                <span className="font-medium whitespace-nowrap">Bec has girls</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/20 px-4 py-3 rounded-full min-w-fit">
                <span className="text-lg sm:text-2xl">🏠</span>
                <span className="font-medium whitespace-nowrap">Ex-partner has girls</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/20 px-4 py-3 rounded-full min-w-fit">
                <span className="text-lg sm:text-2xl">✈️</span>
                <span className="font-medium whitespace-nowrap">Away</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 sm:p-8 bg-gray-50 border-b">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <button
                onClick={() => navigateMonth('prev')}
                className="flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
                disabled={currentYear === 2025 && currentMonth === 6}
              >
                <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                <span>Prev</span>
              </button>
              
              <h2 className="text-xl sm:text-3xl font-bold text-gray-800 text-center px-4">
                {months[currentMonth]} {currentYear}
              </h2>
              
              <button
                onClick={() => navigateMonth('next')}
                className="flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
                disabled={currentYear === 2025 && currentMonth === 11}
              >
                <span>Next</span>
                <ChevronRight size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div className="p-4 sm:p-8">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {daysOfWeek.map(day => (
                <div key={day} className="p-3 sm:p-4 text-center font-bold text-gray-700 bg-gray-100 rounded-lg text-sm sm:text-base">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.substring(0, 3)}</span>
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarDays.map((dayInfo, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col items-center justify-center transition-all duration-200 active:scale-95 sm:hover:scale-105 h-16 p-1 border rounded text-xs sm:h-28 sm:p-4 sm:border-2 sm:rounded-xl sm:text-base ${
                    dayInfo.day ? getCustodyClass(dayInfo.custody) : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {dayInfo.day && (
                    <>
                      <div className="font-bold text-center mb-1 text-xs sm:text-xl">{dayInfo.day}</div>
                      <div className="flex items-center justify-center space-x-1 sm:flex-col sm:space-x-0 sm:space-y-1">
                        <span className="text-xs sm:text-2xl">{getCustodyIcon(dayInfo.custody)}</span>
                        {(dayInfo.work === 'away' || dayInfo.work === 'work' || dayInfo.work === 'takeoff' || dayInfo.work === 'landing') && (
                          <span className="text-xs sm:text-lg">{getWorkIcon(dayInfo.work)}</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer info */}
          <div className="p-4 sm:p-8 bg-gray-50 border-t">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm max-w-4xl mx-auto">
              <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-6 text-center">📋 Schedule Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm sm:text-base text-gray-600">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 text-base sm:text-lg border-b border-pink-200 pb-2">Girls Schedule</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-3 h-3 bg-pink-500 rounded-full flex-shrink-0"></span>
                      <span>Handoffs occur every Friday</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-3 h-3 bg-pink-500 rounded-full flex-shrink-0"></span>
                      <span>Alternating weekly custody</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 text-base sm:text-lg border-b border-purple-200 pb-2">Work Schedule</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></span>
                      <span>Away: July 25 - August 13</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></span>
                      <span>Rotation: 2 weeks on, 2 weeks off</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></span>
                      <span>Wednesday to Wednesday schedule</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustodyCalendar;
