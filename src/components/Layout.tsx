// src/components/Layout.tsx

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardBG from '../assets/darkBg.svg';


export default function Layout() {
  const location = useLocation();

  // Determine if the current path is the dashboard ("/")
  const isDashboard = location.pathname === '/';

  return (
    <div
      className={`flex h-screen ${isDashboard ? 'bg-cover bg-center bg-no-repeat' : ''}`}
      style={isDashboard ? { backgroundImage: `url(${DashboardBG})` } : {}}
    >
      <div className='pt-3 pb-4 pl-4 min-h-screen'>
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}