import React, { useContext } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbars';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import RoleSelection from './pages/Login/RoleSelection';
import StudentLogin from './pages/Login/StudentLogin';
import AlumniLogin from './pages/Login/AlumniLogin';
import { StoreContext } from './context/StoreContext';
import Profile from './pages/Profile/Profile';
import Mentorship from './pages/Mentorship/Mentorship';
import Jobs from './pages/Jobs/Jobs';
import Dashboard from './pages/Dashboard/Dashboard';

import ProtectedRoute from './components/ProtectedRoute';
import StudentLayout from './layouts/StudentLayout';
import AlumniLayout from './layouts/AlumniLayout';

import StudentDashboardOverview from './pages/Student/StudentDashboardOverview';
import MentorsBrowser from './pages/Student/MentorsBrowser';
import MessagesView from './pages/Student/MessagesView';
import Appointments from './pages/Student/Appointments';
import StudentEvents from './pages/Student/StudentEvents';
import LinkedInFeed from './pages/Student/LinkedInFeed';

// New Alumni Dashboard Pages
import ProfileSection   from './pages/Alumni/ProfileSection';
import StudentRequests  from './pages/Alumni/StudentRequests';
import Opportunities    from './pages/Alumni/Opportunities';
import Messages         from './pages/Alumni/Messages';
import Events           from './pages/Alumni/Events';
import Analytics        from './pages/Alumni/Analytics';
import Settings         from './pages/Alumni/Settings';

const App = () => {
  const { showLogin, setShowLogin } = useContext(StoreContext);

  return (
    <main>
      <div className='app'>
        <Routes>
          {/* Public Routes with standard Navbar & Footer */}
          <Route element={
            <div className="flex flex-col min-h-screen">
              <Navbar setShowLogin={setShowLogin} />
              <div className="flex-1">
                <Outlet />
              </div>
              <Footer />
            </div>
          }>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<RoleSelection />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/login/alumni" element={<AlumniLogin />} />
            <Route path="/alumni-discovery" element={<MentorsBrowser />} />
          </Route>

          {/* Protected Student Routes */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentLayout /></ProtectedRoute>}>
            <Route index element={<StudentDashboardOverview />} />
            <Route path="dashboard"    element={<StudentDashboardOverview />} />
            <Route path="opportunities" element={<Jobs />} />
            <Route path="internships"  element={<Jobs />} />
            <Route path="mentors"      element={<MentorsBrowser />} />
            <Route path="messages"     element={<MessagesView />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="events"       element={<StudentEvents />} />
            <Route path="feed"         element={<LinkedInFeed />} />
          </Route>

          {/* Protected Alumni Routes */}
          <Route path="/alumni" element={<ProtectedRoute allowedRoles={['alumni']}><AlumniLayout /></ProtectedRoute>}>
            <Route index                   element={<Dashboard />} />
            <Route path="dashboard"        element={<Dashboard />} />
            <Route path="profile"          element={<ProfileSection />} />
            <Route path="requests"         element={<StudentRequests />} />
            <Route path="opportunities"    element={<Opportunities />} />
            <Route path="messages"         element={<Messages />} />
            <Route path="events"           element={<Events />} />
            <Route path="analytics"        element={<Analytics />} />
            <Route path="settings"         element={<Settings />} />
            {/* Legacy routes kept for backward compat */}
            <Route path="post-opportunity" element={<Opportunities />} />
          </Route>
        </Routes>
      </div>
    </main>
  );
};

export default App;

