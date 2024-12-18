import React, { useState } from 'react';
import { X, Users, Image as ImageIcon, Search } from 'lucide-react';
import { User } from '../../types';

interface CreateGroupModalProps {
  contacts: User[];
  onCreateGroup: (groupName: string, description: string, members: number[]) => void;
  onClose: () => void;
}

export default function CreateGroupModal({ contacts, onCreateGroup, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [groupImage, setGroupImage] = useState<string>('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() && selectedMembers.length > 0) {
      onCreateGroup(groupName.trim(), description.trim(), selectedMembers);
      onClose();
    }
  };

  const toggleMember = (userId: number) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users size={20} />
            Create New Group
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20">
                <img
                  src={groupImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(groupName || 'Group')}`}
                  alt="Group avatar"
                  className="w-full h-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg"
                >
                  <ImageIcon size={16} className="text-gray-600" />
                </button>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Group name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Group description (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Add Members</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="border rounded-lg max-h-48 overflow-y-auto">
            {filteredContacts.map(contact => (
              <label
                key={contact.userId}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(contact.userId)}
                  onChange={() => toggleMember(contact.userId)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <img
                  src={contact.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}`}
                  alt={contact.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!groupName.trim() || selectedMembers.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}