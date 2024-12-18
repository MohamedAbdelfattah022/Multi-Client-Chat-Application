import React from 'react';
import { X, Users, MessageSquare, UserPlus } from 'lucide-react';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  icon?: 'users' | 'message' | 'user-plus';
}

export default function ModalHeader({ title, onClose, icon }: ModalHeaderProps) {
  const IconComponent = {
    users: Users,
    message: MessageSquare,
    'user-plus': UserPlus,
  }[icon || 'message'];

  return (
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        {IconComponent && <IconComponent size={20} />}
        {title}
      </h2>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-500 transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  );
}