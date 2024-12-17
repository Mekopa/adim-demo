import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Briefcase,
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

import SettingsModal from './settings/SettingsModal';
import useAuth from '../contexts/useAuth';
import Logo from './shared/icons/Logo';

const navigation = [
  { name: 'Workflows', href: '/workflows', icon: FileText },
  { name: 'Vault', href: '/vault', icon: Briefcase },
  { name: 'Assistant', href: '/assistant', icon: MessageSquare },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <div 
        className="flex flex-col bg-surface rounded-r-2xl border-border transition-all duration-300 relative"
        style={{ width: isExpanded ? '240px' : '70px' }}
      >
        <div className="flex items-center justify-between px-3 py-4 border-border">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3"
          >
             <Logo className="w-12 h-12 text-primary mx-auto" /> {/* Added mx-auto */}
            {isExpanded && (
              <span className="font-bold text-text">ADIM</span>
            )}
          </button>
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-background rounded-full transition-colors"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="w-5 h-5 text-text-secondary" />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(true)}
          className={`absolute -right-3 top-16 p-1.5 bg-surface border border-border rounded-full hover:bg-background transition-colors ${
            isExpanded ? 'hidden' : 'block'
          }`}
          aria-label="Open sidebar"
        >
          <ChevronRight className="w-4 h-4 text-text-secondary" />
        </button>
        
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-text-secondary hover:bg-background'
                      }`
                    }
                  >
                    <Icon className="w-6 h-6 flex-shrink-0" />
                    {isExpanded && <span>{item.name}</span>}
                    {!isExpanded && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-surface border border-border text-text text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-2 py-6 space-y-4">
          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-background transition-colors relative group"
          >
            <Settings className="w-6 h-6 flex-shrink-0" />
            {isExpanded && <span>Settings</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-surface border border-border text-text text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                Settings
              </div>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-background transition-colors relative group"
          >
            <LogOut className="w-6 h-6 flex-shrink-0" />
            {isExpanded && <span>Logout</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-surface border border-border text-text text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </div>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}