import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import { useChatStore } from '../../stores/chatStore';

export const ChatLayout: React.FC = () => {
  const { loadFriends, loadGroups } = useChatStore();

  useEffect(() => {
    loadFriends();
    loadGroups();
  }, [loadFriends, loadGroups]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};