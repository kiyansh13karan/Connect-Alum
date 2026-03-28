import React from 'react';

const AlumniEvents = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Manage Events</h2>
      <div className="text-slate-600">
        <p>Host webinars, Q&A sessions, or informal meetups with students.</p>
        <div className="mt-8 border border-slate-200 rounded-md p-8 text-center bg-slate-50">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 transition">
            + Create New Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlumniEvents;
