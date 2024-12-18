import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { Group, User } from '../../types';
import CreateGroupModal from './modals/CreateGroupModal';
import Avatar from '../common/Avatar';
import SearchInput from '../common/SearchInput';

interface GroupListProps {
  groups: Group[];
  contacts: User[];
  onGroupSelect: (groupId: number) => void;
  onCreateGroup: (name: string, description: string, members: number[]) => void;
}

export default function GroupList({ 
  groups, 
  contacts,
  onGroupSelect, 
  onCreateGroup 
}: GroupListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = groups.filter(group =>
    group.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users size={20} />
            Groups
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            aria-label="Create new group"
          >
            <Plus size={20} />
          </button>
        </div>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search groups..."
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-4">
          {filteredGroups.map((group) => (
            <button
              key={group.groupId}
              onClick={() => onGroupSelect(group.groupId)}
              className="w-full p-3 hover:bg-gray-50 rounded-lg flex items-center space-x-3 transition-colors"
            >
              <div className="relative">
                <img
                  src={group.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(group.groupName)}`}
                  alt={group.groupName}
                  className="w-12 h-12 rounded-full"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-medium truncate">{group.groupName}</p>
                <p className="text-sm text-gray-500 truncate">
                  {group.members.length} members
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateGroupModal
          contacts={contacts}
          onCreateGroup={(...args) => {
            onCreateGroup(...args);
            setShowCreateModal(false);
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}