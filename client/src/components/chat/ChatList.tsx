import React, { useState } from 'react';
import { User, Message } from '../../types';
import NewChatButton from './NewChatButton';
import NewChatModal from './NewChatModal';
import ChatListItem from './ChatListItem';
import SearchInput from '../common/SearchInput';

interface ChatListProps {
  chats: Array<{
    user: User;
    lastMessage: Message;
    unreadCount: number;
  }>;
  contacts: User[];
  onChatSelect: (userId: number) => void;
}

export default function ChatList({ chats = [], contacts = [], onChatSelect }: ChatListProps) {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 space-y-4">
        <NewChatButton onClick={() => setShowNewChatModal(true)} />
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search chats..."
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.map(({ user, lastMessage, unreadCount }) => (
          <ChatListItem
            key={user.userId}
            user={user}
            lastMessage={lastMessage}
            unreadCount={unreadCount}
            onClick={() => onChatSelect(user.userId)}
          />
        ))}
      </div>

      {showNewChatModal && (
        <NewChatModal
          contacts={contacts}
          onStartChat={onChatSelect}
          onClose={() => setShowNewChatModal(false)}
        />
      )}
    </div>
  );
}