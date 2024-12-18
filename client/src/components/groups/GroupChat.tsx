import React, { useState } from 'react';
import { Send, Image, Settings, UserPlus } from 'lucide-react';
import { Group, Message, User } from '../../types';

interface GroupChatProps {
  group: Group;
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string, groupId: number) => void;
  onAddMember: () => void;
  onOpenSettings: () => void;
}

export default function GroupChat({
  group,
  messages,
  currentUser,
  onSendMessage,
  onAddMember,
  onOpenSettings,
}: GroupChatProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage, group.groupId);
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={group.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(group.groupName)}`}
            alt={group.groupName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="font-medium">{group.groupName}</h2>
            <p className="text-sm text-gray-500">{group.members.length} members</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onAddMember}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <UserPlus size={20} />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.messageId}
            className={`flex ${message.senderId === currentUser.userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === currentUser.userId ? 'bg-indigo-600 text-white' : 'bg-gray-100'
              }`}
            >
              <p>{message.messageContent}</p>
              <div className="flex items-center justify-end space-x-2 mt-1">
                <span className="text-xs opacity-75">
                  {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <Image size={24} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}