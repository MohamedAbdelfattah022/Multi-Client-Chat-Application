import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { User } from '../../types';

interface NewChatModalProps {
  contacts: User[];
  onStartChat: (userId: number) => void;
  onClose: () => void;
}

export default function NewChatModal({ contacts, onStartChat, onClose }: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">New Message</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredContacts.map(contact => (
              <button
                key={contact.userId}
                onClick={() => {
                  onStartChat(contact.userId);
                  onClose();
                }}
                className="w-full p-3 hover:bg-gray-50 rounded-lg flex items-center space-x-3"
              >
                <img
                  src={contact.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}`}
                  alt={contact.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 text-left">
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}