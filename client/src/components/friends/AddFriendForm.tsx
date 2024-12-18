import React, { useState } from 'react';
import { UserPlus, Mail } from 'lucide-react';

interface AddFriendFormProps {
  onSendRequest: (email: string) => void;
}

export default function AddFriendForm({ onSendRequest }: AddFriendFormProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSendRequest(email.trim());
      setEmail('');
    }
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Add New Friend</h3>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Send Friend Request
        </button>
      </form>
    </div>
  );
}