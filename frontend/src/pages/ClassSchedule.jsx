
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { Calendar, Clock, BookOpen, User, MapPin } from 'lucide-react';

const ClassSchedule = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const getCurrentDay = () => {
    const today = new Date().getDay();
    // Convert to Monday = 0 format
    return today === 0 ? 6 : today - 1;
  };

  const [currentDayIndex, setCurrentDayIndex] = useState(getCurrentDay());

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // NEW: Only 1 Lunch Break, 4 subjects before, 4 after
  const mockSchedule = [
    {
      day: 'Monday',
      periods: [
        { time: '08:00 - 08:45', subject: 'Hindi',              teacher: 'Mr. Sharma',  room: 'Room 101' },
        { time: '08:45 - 09:30', subject: 'English',            teacher: 'Mrs. Patel',  room: 'Room 102' },
        { time: '09:30 - 10:15', subject: 'Mathematics',        teacher: 'Mr. Mehta',   room: 'Room 103' },
        { time: '10:15 - 11:00', subject: 'Science',            teacher: 'Ms. Gupta',   room: 'Lab 201' },
        { time: '11:00 - 11:45', subject: 'Lunch Break',        teacher: '',            room: '' },
        { time: '11:45 - 12:30', subject: 'Social Studies',     teacher: 'Mr. Kumar',   room: 'Room 104' },
        { time: '12:30 - 01:15', subject: 'Computer',           teacher: 'Mr. Verma',   room: 'Lab 301' },
        { time: '01:15 - 02:00', subject: 'GK',                 teacher: 'Ms. Joshi',   room: 'Room 105' },
        { time: '02:00 - 02:45', subject: 'Physical Education', teacher: 'Mr. Singh',   room: 'Ground' }
      ]
    },
    {
      day: 'Tuesday',
      periods: [
        { time: '08:00 - 08:45', subject: 'English',            teacher: 'Mrs. Patel',  room: 'Room 102' },
        { time: '08:45 - 09:30', subject: 'Hindi',              teacher: 'Mr. Sharma',  room: 'Room 101' },
        { time: '09:30 - 10:15', subject: 'Science',            teacher: 'Ms. Gupta',   room: 'Lab 201' },
        { time: '10:15 - 11:00', subject: 'Mathematics',        teacher: 'Mr. Mehta',   room: 'Room 103' },
        { time: '11:00 - 11:45', subject: 'Lunch Break',        teacher: '',            room: '' },
        { time: '11:45 - 12:30', subject: 'Computer',           teacher: 'Mr. Verma',   room: 'Lab 301' },
        { time: '12:30 - 01:15', subject: 'Social Studies',     teacher: 'Mr. Kumar',   room: 'Room 104' },
        { time: '01:15 - 02:00', subject: 'Physical Education', teacher: 'Mr. Singh',   room: 'Ground' },
        { time: '02:00 - 02:45', subject: 'GK',                 teacher: 'Ms. Joshi',   room: 'Room 105' }
      ]
    },
    {
      day: 'Wednesday',
      periods: [
        { time: '08:00 - 08:45', subject: 'Mathematics',        teacher: 'Mr. Mehta',   room: 'Room 103' },
        { time: '08:45 - 09:30', subject: 'Science',            teacher: 'Ms. Gupta',   room: 'Lab 201' },
        { time: '09:30 - 10:15', subject: 'Hindi',              teacher: 'Mr. Sharma',  room: 'Room 101' },
        { time: '10:15 - 11:00', subject: 'English',            teacher: 'Mrs. Patel',  room: 'Room 102' },
        { time: '11:00 - 11:45', subject: 'Lunch Break',        teacher: '',            room: '' },
        { time: '11:45 - 12:30', subject: 'GK',                 teacher: 'Ms. Joshi',   room: 'Room 105' },
        { time: '12:30 - 01:15', subject: 'Social Studies',     teacher: 'Mr. Kumar',   room: 'Room 104' },
        { time: '01:15 - 02:00', subject: 'Computer',           teacher: 'Mr. Verma',   room: 'Lab 301' },
        { time: '02:00 - 02:45', subject: 'Physical Education', teacher: 'Mr. Singh',   room: 'Ground' }
      ]
    },
    {
      day: 'Thursday',
      periods: [
        { time: '08:00 - 08:45', subject: 'Science',            teacher: 'Ms. Gupta',   room: 'Lab 201' },
        { time: '08:45 - 09:30', subject: 'Mathematics',        teacher: 'Mr. Mehta',   room: 'Room 103' },
        { time: '09:30 - 10:15', subject: 'English',            teacher: 'Mrs. Patel',  room: 'Room 102' },
        { time: '10:15 - 11:00', subject: 'Hindi',              teacher: 'Mr. Sharma',  room: 'Room 101' },
        { time: '11:00 - 11:45', subject: 'Lunch Break',        teacher: '',            room: '' },
        { time: '11:45 - 12:30', subject: 'Physical Education', teacher: 'Mr. Singh',   room: 'Ground' },
        { time: '12:30 - 01:15', subject: 'Computer',           teacher: 'Mr. Verma',   room: 'Lab 301' },
        { time: '01:15 - 02:00', subject: 'GK',                 teacher: 'Ms. Joshi',   room: 'Room 105' },
        { time: '02:00 - 02:45', subject: 'Social Studies',     teacher: 'Mr. Kumar',   room: 'Room 104' }
      ]
    },
    {
      day: 'Friday',
      periods: [
        { time: '08:00 - 08:45', subject: 'English',            teacher: 'Mrs. Patel',  room: 'Room 102' },
        { time: '08:45 - 09:30', subject: 'Hindi',              teacher: 'Mr. Sharma',  room: 'Room 101' },
        { time: '09:30 - 10:15', subject: 'Social Studies',     teacher: 'Mr. Kumar',   room: 'Room 104' },
        { time: '10:15 - 11:00', subject: 'GK',                 teacher: 'Ms. Joshi',   room: 'Room 105' },
        { time: '11:00 - 11:45', subject: 'Lunch Break',        teacher: '',            room: '' },
        { time: '11:45 - 12:30', subject: 'Science',            teacher: 'Ms. Gupta',   room: 'Lab 201' },
        { time: '12:30 - 01:15', subject: 'Mathematics',        teacher: 'Mr. Mehta',   room: 'Room 103' },
        { time: '01:15 - 02:00', subject: 'Computer',           teacher: 'Mr. Verma',   room: 'Lab 301' },
        { time: '02:00 - 02:45', subject: 'Physical Education', teacher: 'Mr. Singh',   room: 'Ground' }
      ]
    },
    {
      day: 'Saturday',
      periods: [
        { time: '08:00 - 08:45', subject: 'Computer',           teacher: 'Mr. Verma',   room: 'Lab 301' },
        { time: '08:45 - 09:30', subject: 'Science',            teacher: 'Ms. Gupta',   room: 'Lab 201' },
        { time: '09:30 - 10:15', subject: 'Mathematics',        teacher: 'Mr. Mehta',   room: 'Room 103' },
        { time: '10:15 - 11:00', subject: 'English',            teacher: 'Mrs. Patel',  room: 'Room 102' },
        { time: '11:00 - 11:45', subject: 'Lunch Break',        teacher: '',            room: '' },
        { time: '11:45 - 12:30', subject: 'Hindi',              teacher: 'Mr. Sharma',  room: 'Room 101' },
        { time: '12:30 - 01:15', subject: 'Social Studies',     teacher: 'Mr. Kumar',   room: 'Room 104' },
        { time: '01:15 - 02:00', subject: 'GK',                 teacher: 'Ms. Joshi',   room: 'Room 105' },
        { time: '02:00 - 02:45', subject: 'Physical Education', teacher: 'Mr. Singh',   room: 'Ground' }
      ]
    },
    {
      day: 'Sunday',
      periods: []
    }
  ];

  useEffect(() => {
    // In a real app, fetch schedule from API
    setTimeout(() => {
      setSchedule(mockSchedule);
      setLoading(false);
    }, 500);
  }, []);

  const getDaySchedule = (dayIndex) => {
    return schedule[dayIndex] || { day: daysOfWeek[dayIndex], periods: [] };
  };

  const getCurrentPeriod = (periods) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight

    for (let i = 0; i < periods.length; i++) {
      const period = periods[i];
      // Skip only Lunch Break
      if (period.subject === 'Lunch Break') continue;

      const [startTime, endTime] = period.time.split(' - ');
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      const periodStart = startHour * 60 + startMin;
      const periodEnd = endHour * 60 + endMin;

      if (currentTime >= periodStart && currentTime <= periodEnd) {
        return i;
      }
    }
    return -1;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading schedule...</div>
      </div>
    );
  }

  const todaySchedule = getDaySchedule(currentDayIndex);
  const currentPeriodIndex = getCurrentPeriod(todaySchedule.periods);

  return (
    <div className="text-gray-800">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Class Schedule</h1>
        <p className="text-gray-600">View your weekly timetable</p>
      </div>

      {/* Day Selector */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map((day, index) => (
            <button
              key={day}
              onClick={() => {
                setCurrentDayIndex(index);
                setSelectedDay(null);
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentDayIndex === index
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day}
              {index === getCurrentDay() && (
                <span className="ml-2 text-xs">(Today)</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Today's Schedule - Detailed View */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-4 bg-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <Calendar size={24} />
            <h2 className="text-xl font-semibold">{todaySchedule.day}'s Schedule</h2>
          </div>
        </div>

        {todaySchedule.periods.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No classes scheduled for {todaySchedule.day}</p>
          </div>
        ) : (
          <div className="divide-y">
            {todaySchedule.periods.map((period, index) => {
              const isLunch = period.subject === 'Lunch Break';
              const isCurrent = currentPeriodIndex === index && currentDayIndex === getCurrentDay();
              
              return (
                <div
                  key={index}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    isCurrent ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                  } ${isLunch ? 'bg-gray-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={16} />
                          <span className="font-medium">{period.time}</span>
                        </div>
                        {isCurrent && !isLunch && (
                          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                            Current Period
                          </span>
                        )}
                      </div>
                      {!isLunch && (
                        <>
                          <h3 className="text-lg font-semibold mb-1">{period.subject}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              <span>{period.teacher}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{period.room}</span>
                            </div>
                          </div>
                        </>
                      )}
                      {isLunch && (
                        <p className="text-gray-500 font-medium">{period.subject}</p>
                      )}
                    </div>
                    {!isLunch && (
                      <div className="ml-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <BookOpen size={20} className="text-indigo-600" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Weekly Overview - Compact View */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Weekly Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                {daysOfWeek.slice(0, 6).map((day) => (
                  <th
                    key={day}
                    className={`px-4 py-3 text-center text-sm font-semibold ${
                      schedule.find(s => s.day === day)?.periods.length > 0
                        ? 'text-gray-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {['08:00', '08:45', '09:30', '10:15', '11:45', '12:30', '01:15', '02:00'].map((time) => (
                <tr key={time}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-600">{time}</td>
                  {daysOfWeek.slice(0, 6).map((day) => {
                    const daySchedule = schedule.find(s => s.day === day);
                    const period = daySchedule?.periods.find(p => p.time.startsWith(time));
                    return (
                      <td key={day} className="px-4 py-3 text-center text-sm">
                        {period && period.subject !== 'Lunch Break' ? (
                          <div className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">
                            {period.subject}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassSchedule;
