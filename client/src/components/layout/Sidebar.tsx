import React from 'react';
import { Search, Users, MessageSquare, LogOut } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-20 bg-indigo-600 h-screen flex flex-col items-center py-8">
      <div className="flex-1 space-y-6">
        <button className="p-3 text-white hover:bg-indigo-700 rounded-xl transition-colors">
          <MessageSquare size={24} />
        </button>
        <button className="p-3 text-white hover:bg-indigo-700 rounded-xl transition-colors">
          <Users size={24} />
        </button>
        <button className="p-3 text-white hover:bg-indigo-700 rounded-xl transition-colors">
          <Search size={24} />
        </button>
      </div>
      <button className="p-3 text-white hover:bg-indigo-700 rounded-xl transition-colors">
        <LogOut size={24} />
      </button>
    </div>
  );
}