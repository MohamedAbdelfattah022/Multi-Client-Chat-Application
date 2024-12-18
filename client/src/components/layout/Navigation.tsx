import React from 'react';
import { MessageSquare, Users, UserPlus, Settings, LogOut } from 'lucide-react';

interface NavigationProps {
  activeTab: 'chats' | 'groups' | 'requests' | 'settings';
  onTabChange: (tab: 'chats' | 'groups' | 'requests' | 'settings') => void;
  onLogout: () => void;
}

export default function Navigation({ activeTab, onTabChange, onLogout }: NavigationProps) {
  return (
    <div className="w-20 bg-indigo-600 h-screen flex flex-col items-center py-8">
      <div className="flex-1 space-y-6">
        <button
          onClick={() => onTabChange('chats')}
          className={`p-3 text-white rounded-xl transition-colors ${
            activeTab === 'chats' ? 'bg-indigo-700' : 'hover:bg-indigo-700'
          }`}
        >
          <MessageSquare size={24} />
        </button>
        <button
          onClick={() => onTabChange('groups')}
          className={`p-3 text-white rounded-xl transition-colors ${
            activeTab === 'groups' ? 'bg-indigo-700' : 'hover:bg-indigo-700'
          }`}
        >
          <Users size={24} />
        </button>
        <button
          onClick={() => onTabChange('requests')}
          className={`p-3 text-white rounded-xl transition-colors ${
            activeTab === 'requests' ? 'bg-indigo-700' : 'hover:bg-indigo-700'
          }`}
        >
          <UserPlus size={24} />
        </button>
        <button
          onClick={() => onTabChange('settings')}
          className={`p-3 text-white rounded-xl transition-colors ${
            activeTab === 'settings' ? 'bg-indigo-700' : 'hover:bg-indigo-700'
          }`}
        >
          <Settings size={24} />
        </button>
      </div>
      <button
        onClick={onLogout}
        className="p-3 text-white hover:bg-indigo-700 rounded-xl transition-colors"
      >
        <LogOut size={24} />
      </button>
    </div>
  );
}