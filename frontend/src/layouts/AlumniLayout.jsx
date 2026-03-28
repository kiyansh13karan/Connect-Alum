import React, { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbars';
import { StoreContext } from '../context/StoreContext';

const AlumniLayout = () => {
    const { setShowLogin } = useContext(StoreContext);

    return (
        <div className="flex flex-col min-h-screen pt-20">
            <Navbar setShowLogin={setShowLogin} />
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col gap-4 shadow-md">
                    <h2 className="text-xl font-bold mb-6 text-yellow-400">Alumni Portal</h2>
                    <nav className="flex flex-col gap-4">
                        <Link to="/alumni/dashboard" className="text-slate-300 hover:text-white font-semibold transition-colors">Dashboard</Link>
                        <Link to="/alumni/post-opportunity" className="text-slate-300 hover:text-white font-semibold transition-colors">Post Opportunity</Link>
                        <Link to="/alumni/messages" className="text-slate-300 hover:text-white font-semibold transition-colors">Messages</Link>
                        <Link to="/alumni/events" className="text-slate-300 hover:text-white font-semibold transition-colors">Manage Events</Link>
                    </nav>
                </aside>
                {/* Main Content */}
                <main className="flex-1 p-8 bg-slate-50 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AlumniLayout;
