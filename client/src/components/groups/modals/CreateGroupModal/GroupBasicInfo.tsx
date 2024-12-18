import React from 'react';
import { ImageIcon } from 'lucide-react';
import Avatar from '../../../common/Avatar';

interface GroupBasicInfoProps {
  groupName: string;
  description: string;
  groupImage: string;
  onGroupNameChange: (name: string) => void;
  onDescriptionChange: (desc: string) => void;
  onImageChange: (image: string) => void;
}

export default function GroupBasicInfo({
  groupName,
  description,
  groupImage,
  onGroupNameChange,
  onDescriptionChange,
  onImageChange,
}: GroupBasicInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-lg overflow-hidden">
            <img
              src={groupImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(groupName || 'Group')}`}
              alt="Group avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              // In a real app, this would open an image upload dialog
              onImageChange(`https://ui-avatars.com/api/?name=${encodeURIComponent(groupName || 'Group')}&random=${Date.now()}`);
            }}
            className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-50"
          >
            <ImageIcon size={16} className="text-gray-600" />
          </button>
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={groupName}
            onChange={(e) => onGroupNameChange(e.target.value)}
            placeholder="Group name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Group description (optional)"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
      />
    </div>
  );
}