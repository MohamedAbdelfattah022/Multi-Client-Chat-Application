import React, { useState } from 'react';
import { X, Users, Image as ImageIcon, Trash2, UserMinus, UserPlus, Crown } from 'lucide-react';
import { Group, User } from '../../types';

interface GroupSettingsModalProps {
  group: Group;
  currentUser: User;
  onUpdateGroup: (groupId: number, updates: Partial<Group>) => void;
  onDeleteGroup: (groupId: number) => void;
  onRemoveMember: (groupId: number, userId: number) => void;
  onPromoteToAdmin: (groupId: number, userId: number) => void;
  onClose: () => void;
}

export default function GroupSettingsModal({
  group,
  currentUser,
  onUpdateGroup,
  onDeleteGroup,
  onRemoveMember,
  onPromoteToAdmin,
  onClose,
}: GroupSettingsModalProps) {
  const [groupName, setGroupName] = useState(group.groupName);
  const [description, setDescription] = useState(group.description || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isAdmin = group.members.find(m => m.userId === currentUser.userId)?.isAdmin;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim()) {
      onUpdateGroup(group.groupId, {
        groupName: groupName.trim(),
        description: description.trim(),
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users size={20} />
            Group Settings
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20">
                <img
                  src={group.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(group.groupName)}`}
                  alt="Group avatar"
                  className="w-full h-full rounded-lg object-cover"
                />
                {isAdmin && (
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg"
                  >
                    <ImageIcon size={16} className="text-gray-600" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Group name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={!isAdmin}
                  required
                />
              </div>
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Group description (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
              disabled={!isAdmin}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Members</h3>
            <div className="border rounded-lg max-h-48 overflow-y-auto">
              {group.members.map(member => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=User`}
                      alt="User avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">User {member.userId}</p>
                      {member.isAdmin && (
                        <span className="text-xs text-indigo-600 flex items-center gap-1">
                          <Crown size={12} />
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                  {isAdmin && member.userId !== currentUser.userId && (
                    <div className="flex space-x-2">
                      {!member.isAdmin && (
                        <button
                          type="button"
                          onClick={() => onPromoteToAdmin(group.groupId, member.userId)}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-full"
                        >
                          <Crown size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onRemoveMember(group.groupId, member.userId)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <UserMinus size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isAdmin && (
            <div className="flex justify-between pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Group
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </form>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Group</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete this group? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteGroup(group.groupId);
                    onClose();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}