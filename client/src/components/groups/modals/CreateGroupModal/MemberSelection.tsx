import React, { useState } from 'react';
import { User } from '../../../../types';
import SearchInput from '../../../common/SearchInput';
import Avatar from '../../../common/Avatar';

interface MemberSelectionProps {
  contacts: User[];
  selectedMembers: number[];
  onMemberToggle: (userId: number) => void;
}

export default function MemberSelection({
  contacts,
  selectedMembers,
  onMemberToggle,
}: MemberSelectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Add Members</label>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search contacts..."
      />

      <div className="border rounded-lg max-h-48 overflow-y-auto">
        {filteredContacts.map(contact => (
          <label
            key={contact.userId}
            className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedMembers.includes(contact.userId)}
              onChange={() => onMemberToggle(contact.userId)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <Avatar user={contact} size={10} />
            <div className="flex-1">
              <p className="font-medium">{contact.name}</p>
              <p className="text-sm text-gray-500">{contact.email}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}