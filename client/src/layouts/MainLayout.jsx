import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
