import React from 'react';

const AlumniMessages = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Messages</h2>
      <div className="text-slate-600">
        <p>Welcome to your Alumni inbox.</p>
        <div className="mt-8 border border-slate-200 rounded-md p-8 text-center bg-slate-50">
          <p className="text-slate-500">No new messages yet. When a student reaches out, their message will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default AlumniMessages;
