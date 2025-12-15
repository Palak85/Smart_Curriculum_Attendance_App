// src/pages/MyClassSchedule.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { Calendar, Clock, BookOpen, User, MapPin } from 'lucide-react';

const TeacherMyClass = () => {
  const { user } = useAuth(); // teacher user (name, email, role)
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1; // Monday=0 ... Sunday=6
  });
  const [selectedClassSection, setSelectedClassSection] = useState('All'); // filter by class-section
  const [availableClasses, setAvailableClasses] = useState([]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // MOCK timetable (frontend-only). Replace or edit as needed.
  const mockTeacherSchedule = [
    {
      day: 'Monday',
      periods: [
        { time: '08:00 - 08:45', subject: 'Mathematics', class: '5', section: 'A', room: 'Room 103' },
        { time: '08:45 - 09:30', subject: 'Mathematics', class: '5', section: 'B', room: 'Room 103' },
        { time: '09:30 - 10:15', subject: 'Science',     class: '6', section: 'A', room: 'Lab 201' },
        { time: '10:15 - 11:00', subject: 'Science',     class: '6', section: 'B', room: 'Lab 201' },
        { time: '11:00 - 11:45', subject: 'Lunch Break', class: '',  section: '',  room: '' },
        { time: '11:45 - 12:30', subject: 'Computer',    class: '5', section: 'A', room: 'Lab 301' },
        { time: '12:30 - 01:15', subject: 'Computer',    class: '5', section: 'B', room: 'Lab 301' },
        { time: '01:15 - 02:00', subject: 'GK',          class: '4', section: 'A', room: 'Room 105' },
        { time: '02:00 - 02:45', subject: 'Physical Ed', class: 'All', section: 'All', room: 'Ground' }
      ]
    },
    {
      day: 'Tuesday',
      periods: [
        { time: '08:00 - 08:45', subject: 'Mathematics', class: '5', section: 'A', room: 'Room 103' },
        { time: '08:45 - 09:30', subject: 'Mathematics', class: '5', section: 'B', room: 'Room 103' },
        { time: '09:30 - 10:15', subject: 'English',     class: '5', section: 'A', room: 'Room 102' },
        { time: '10:15 - 11:00', subject: 'English',     class: '5', section: 'B', room: 'Room 102' },
        { time: '11:00 - 11:45', subject: 'Lunch Break', class: '',  section: '',  room: '' },
        { time: '11:45 - 12:30', subject: 'Mathematics', class: '6', section: 'A', room: 'Room 103' },
        { time: '12:30 - 01:15', subject: 'Mathematics', class: '6', section: 'B', room: 'Room 103' },
        { time: '01:15 - 02:00', subject: 'Science',     class: '5', section: 'A', room: 'Lab 201' },
        { time: '02:00 - 02:45', subject: 'Science',     class: '5', section: 'B', room: 'Lab 201' }
      ]
    },
    {
      day: 'Wednesday',
      periods: [
        { time: '08:00 - 08:45', subject: 'Science', class: '6', section: 'A', room: 'Lab 201' },
        { time: '08:45 - 09:30', subject: 'Science', class: '6', section: 'B', room: 'Lab 201' },
        { time: '09:30 - 10:15', subject: 'Mathematics', class: '5', section: 'A', room: 'Room 103' },
        { time: '10:15 - 11:00', subject: 'Mathematics', class: '5', section: 'B', room: 'Room 103' },
        { time: '11:00 - 11:45', subject: 'Lunch Break', class: '', section: '', room: '' },
        { time: '11:45 - 12:30', subject: 'Computer', class: '6', section: 'A', room: 'Lab 301' },
        { time: '12:30 - 01:15', subject: 'Computer', class: '6', section: 'B', room: 'Lab 301' },
        { time: '01:15 - 02:00', subject: 'GK', class: '5', section: 'A', room: 'Room 105' },
        { time: '02:00 - 02:45', subject: 'Physical Ed', class: 'All', section: 'All', room: 'Ground' }
      ]
    },
    {
      day: 'Thursday',
      periods: [
        { time: '08:00 - 08:45', subject: 'Mathematics', class: '5', section: 'A', room: 'Room 103' },
        { time: '08:45 - 09:30', subject: 'Mathematics', class: '5', section: 'B', room: 'Room 103' },
        { time: '09:30 - 10:15', subject: 'Science', class: '6', section: 'A', room: 'Lab 201' },
        { time: '10:15 - 11:00', subject: 'Science', class: '6', section: 'B', room: 'Lab 201' },
        { time: '11:00 - 11:45', subject: 'Lunch Break', class: '', section: '', room: '' },
        { time: '11:45 - 12:30', subject: 'English', class: '5', section: 'A', room: 'Room 102' },
        { time: '12:30 - 01:15', subject: 'English', class: '5', section: 'B', room: 'Room 102' },
        { time: '01:15 - 02:00', subject: 'Mathematics', class: '6', section: 'A', room: 'Room 103' },
        { time: '02:00 - 02:45', subject: 'Mathematics', class: '6', section: 'B', room: 'Room 103' }
      ]
    },
    {
      day: 'Friday',
      periods: [
        { time: '08:00 - 08:45', subject: 'Mathematics', class: '6', section: 'A', room: 'Room 103' },
        { time: '08:45 - 09:30', subject: 'Mathematics', class: '6', section: 'B', room: 'Room 103' },
        { time: '09:30 - 10:15', subject: 'English', class: '6', section: 'A', room: 'Room 102' },
        { time: '10:15 - 11:00', subject: 'English', class: '6', section: 'B', room: 'Room 102' },
        { time: '11:00 - 11:45', subject: 'Lunch Break', class: '', section: '', room: '' },
        { time: '11:45 - 12:30', subject: 'Computer', class: '5', section: 'A', room: 'Lab 301' },
        { time: '12:30 - 01:15', subject: 'Computer', class: '5', section: 'B', room: 'Lab 301' },
        { time: '01:15 - 02:00', subject: 'Science', class: '6', section: 'A', room: 'Lab 201' },
        { time: '02:00 - 02:45', subject: 'Science', class: '6', section: 'B', room: 'Lab 201' }
      ]
    },
    {
      day: 'Saturday',
      periods: [
        { time: '08:00 - 08:45', subject: 'Revision', class: '5', section: 'A', room: 'Room 103' },
        { time: '08:45 - 09:30', subject: 'Revision', class: '5', section: 'B', room: 'Room 103' },
        { time: '09:30 - 10:15', subject: 'Sports', class: 'All', section: 'All', room: 'Ground' },
        { time: '10:15 - 11:00', subject: 'Club', class: 'All', section: 'All', room: 'Room 105' },
        { time: '11:00 - 11:45', subject: 'Lunch Break', class: '', section: '', room: '' }
      ]
    },
    { day: 'Sunday', periods: [] }
  ];

  // fill schedule and build available class-section list
  useEffect(() => {
    setLoading(true);

    // frontend-only: use mock data
    setTimeout(() => {
      setSchedule(mockTeacherSchedule);

      const combos = new Set();
      mockTeacherSchedule.forEach(day => {
        day.periods.forEach(p => {
          if (p.class && p.section) combos.add(`${p.class}-${p.section}`);
          else if (p.class === 'All') combos.add('All Classes');
        });
      });
      setAvailableClasses(['All', ...Array.from(combos)]);
      setLoading(false);
    }, 250);
  }, [user]);

  const getDaySchedule = (index) => schedule[index] || { day: daysOfWeek[index], periods: [] };

  const getCurrentPeriodIndex = (periods) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    for (let i = 0; i < periods.length; i++) {
      const p = periods[i];
      if (p.subject === 'Lunch Break') continue;
      const [s, e] = p.time.split(' - ');
      const [sh, sm] = s.split(':').map(Number);
      const [eh, em] = e.split(':').map(Number);
      const start = sh * 60 + sm;
      const end = eh * 60 + em;
      if (currentMinutes >= start && currentMinutes <= end) return i;
    }
    return -1;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading timetable...</div>
      </div>
    );
  }

  const daySchedule = getDaySchedule(selectedDayIndex);
  const currentIndex = getCurrentPeriodIndex(daySchedule.periods);

  const teachesPeriod = (period) => {
    if (!period) return false;
    // Mock assumption: this teacher teaches everything in mock (edit if needed)
    return period.subject && period.subject !== 'Lunch Break';
  };

  const periodMatchesFilter = (period) => {
    if (!period) return false;
    if (selectedClassSection === 'All') return true;
    if (selectedClassSection === 'All Classes') return period.class === 'All';
    const [cls, sec] = selectedClassSection.split('-');
    return String(period.class) === String(cls) && String(period.section) === String(sec);
  };

  return (
    <div className="text-gray-800">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Class Timetable</h1>
        <p className="text-gray-600">Your teaching schedule for the week</p>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Show:</div>
          <select
            value={selectedClassSection}
            onChange={(e) => setSelectedClassSection(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            {availableClasses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 flex-wrap">
          {daysOfWeek.map((d, i) => (
            <button
              key={d}
              onClick={() => setSelectedDayIndex(i)}
              className={`px-3 py-2 rounded-lg text-sm ${selectedDayIndex === i ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {d.substring(0, 3)}
              {i === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1) && (
                <span className="ml-2 text-xs">(Today)</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed day view */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-4 bg-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <Calendar size={24} />
            <h2 className="text-xl font-semibold">{daySchedule.day}'s Timetable</h2>
            <div className="ml-auto text-sm opacity-90">Teacher: {user?.name || 'You'}</div>
          </div>
        </div>

        {daySchedule.periods.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No periods scheduled for {daySchedule.day}</p>
          </div>
        ) : (
          <div className="divide-y">
            {daySchedule.periods.map((period, idx) => {
              const isLunch = period.subject === 'Lunch Break';
              const isCurrent = currentIndex === idx && selectedDayIndex === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
              const teaches = teachesPeriod(period);
              const visible = periodMatchesFilter(period);

              return (
                <div
                  key={idx}
                  className={`p-4 hover:bg-gray-50 transition-colors ${isCurrent ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''} ${isLunch ? 'bg-gray-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={16} />
                          <span className="font-medium">{period.time}</span>
                        </div>
                        {isCurrent && !isLunch && (
                          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Current</span>
                        )}
                        {teaches && !isLunch && (
                          <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-800 ml-2">You teach</span>
                        )}
                      </div>

                      {!isLunch && visible ? (
                        <>
                          <h3 className="text-lg font-semibold mb-1">{period.subject}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              <span>Class: {period.class}{period.section ? ` - ${period.section}` : ''}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{period.room}</span>
                            </div>
                          </div>
                        </>
                      ) : isLunch ? (
                        <p className="text-gray-500 font-medium">{period.subject}</p>
                      ) : (
                        <p className="text-gray-400 italic">Not in selected filter</p>
                      )}
                    </div>

                    {!isLunch && visible && (
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

      {/* Weekly compact overview */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Weekly Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                {daysOfWeek.slice(0, 6).map((d) => (
                  <th key={d} className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    {d.substring(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {['08:00', '08:45', '09:30', '10:15', '11:45', '12:30', '01:15', '02:00'].map((time) => (
                <tr key={time}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-600">{time}</td>
                  {daysOfWeek.slice(0, 6).map((d) => {
                    const day = schedule.find(s => s.day === d);
                    const period = day?.periods.find(p => p.time.startsWith(time));
                    if (!period) return <td key={d} className="px-4 py-3 text-center text-sm"><span className="text-gray-400">-</span></td>;

                    const visible = periodMatchesFilter(period);
                    return (
                      <td key={d} className="px-4 py-3 text-center text-sm">
                        {period && period.subject !== 'Lunch Break' && visible ? (
                          <div className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">
                            {period.subject} ({period.class}{period.section ? `-${period.section}` : ''})
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

export default TeacherMyClass;
