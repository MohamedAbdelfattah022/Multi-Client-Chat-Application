import React from 'react';
import { User, Message } from '../../types';
import { formatTime } from '../../utils/dateUtils';
import Avatar from '../common/Avatar';

interface ChatListItemProps {
  user: User;
  lastMessage: Message;
  unreadCount: number;
  onClick: () => void;
}

export default function ChatListItem({ user, lastMessage, unreadCount, onClick }: ChatListItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 hover:bg-gray-50 flex items-center space-x-4"
    >
      <Avatar user={user} size={12} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-medium truncate">{user.name}</p>
          <span className="text-xs text-gray-500">
            {formatTime(lastMessage.sentAt)}
          </span>
        </div>
        <p className="text-sm text-gray-500 truncate">{lastMessage.messageContent}</p>
      </div>
      {unreadCount > 0 && (
        <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
}