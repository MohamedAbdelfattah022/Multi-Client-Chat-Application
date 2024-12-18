import React from 'react';
import { MessageSquarePlus } from 'lucide-react';

interface NewChatButtonProps {
  onClick: () => void;
}

export default function NewChatButton({ onClick }: NewChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <MessageSquarePlus className="h-5 w-5 mr-2" />
      New Message
    </button>
  );
}