import React, { useState } from 'react';
import { Send, Image, Edit2, Trash2 } from 'lucide-react';
import { Message, User } from '../../types';

interface ChatWindowProps {
  currentUser: User;
  recipient: User;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onEditMessage: (messageId: number, content: string) => void;
  onDeleteMessage: (messageId: number) => void;
}

export default function ChatWindow({
  currentUser,
  recipient,
  messages,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="border-b border-gray-200 p-4 flex items-center space-x-4">
        <img
          src={recipient.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(recipient.name)}`}
          alt={recipient.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-medium">{recipient.name}</h2>
          <p className="text-sm text-gray-500">Online</p>
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
              {editingMessageId === message.messageId ? (
                <input
                  type="text"
                  value={message.messageContent}
                  onChange={(e) => onEditMessage(message.messageId, e.target.value)}
                  onBlur={() => setEditingMessageId(null)}
                  className="w-full bg-transparent border-none focus:outline-none"
                  autoFocus
                />
              ) : (
                <>
                  <p>{message.messageContent}</p>
                  <div className="flex items-center justify-end space-x-2 mt-1">
                    <span className="text-xs opacity-75">
                      {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.senderId === currentUser.userId && (
                      <>
                        <button
                          onClick={() => setEditingMessageId(message.messageId)}
                          className="opacity-75 hover:opacity-100"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteMessage(message.messageId)}
                          className="opacity-75 hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
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