import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Activity, Bell, BarChart3, Cog, Gauge, Cpu, MessageCircle, Zap } from 'lucide-react';
import { Chatbot } from '../widgets/Chatbot';

export function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="h-full grid" style={{ gridTemplateColumns: '260px 1fr' }}>
      <aside className="bg-surface border-r border-white/5 p-4 flex flex-col gap-4">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-white">EchoTrack</span>
        </Link>
        <nav className="flex flex-col text-sm">
          <SidebarLink to="/dashboard" icon={<Gauge size={16} />}>Overview</SidebarLink>
          <SidebarLink to="/dashboard/consumption" icon={<Cpu size={16} />}>Usage</SidebarLink>
          <SidebarLink to="/dashboard/trends" icon={<BarChart3 size={16} />}>Trend Analysis</SidebarLink>
          <SidebarLink to="/dashboard/cost" icon={<Activity size={16} />}>Cost & Efficiency</SidebarLink>
          <SidebarLink to="/dashboard/alerts" icon={<Bell size={16} />}>Alerts</SidebarLink>
          <SidebarLink to="#" icon={<Cog size={16} />}>Settings</SidebarLink>
        </nav>
        <div className="mt-auto">
          <div className="flex items-center gap-2 px-2 py-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <div>
              <div className="text-sm font-medium text-white">Jane Doe</div>
              <div className="text-xs text-gray-400">jane.doe@example.com</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full text-left text-xs text-gray-500 hover:text-white px-2 py-1"
          >
            © {new Date().getFullYear()} EchoTrack
          </button>
        </div>
      </aside>
      <main className="relative bg-background">
        <header className="sticky top-0 z-10 border-b border-white/5 bg-background/70 backdrop-blur px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Energy Dashboard</h1>
            <p className="text-xs text-gray-400">Monitor your energy usage in real-time and optimize for efficiency.</p>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <Bell size={18} className="hover:text-white cursor-pointer" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center cursor-pointer">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
          </div>
        </header>
        <div className="p-6 space-y-6">
          <Outlet />
        </div>
        <Chatbot />
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode; }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) => (
        `flex items-center gap-2 rounded-md px-2 py-2 transition-colors ${isActive ? 'bg-white/5 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
      )}
    >
      <span className="text-gray-300">{icon}</span>
      {children}
    </NavLink>
  );
}




