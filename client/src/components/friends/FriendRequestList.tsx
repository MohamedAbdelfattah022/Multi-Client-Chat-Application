import React from 'react';
import { Check, X, UserPlus } from 'lucide-react';
import { User, FriendRequest } from '../../types';
import AddFriendForm from './AddFriendForm';

interface FriendRequestListProps {
  requests: Array<{ request: FriendRequest; user: User }>;
  onAccept: (requestId: number) => void;
  onReject: (requestId: number) => void;
  onSendRequest: (email: string) => void;
}

export default function FriendRequestList({
  requests,
  onAccept,
  onReject,
  onSendRequest,
}: FriendRequestListProps) {
  return (
    <div className="w-80 border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <UserPlus size={20} />
          Friend Requests
        </h2>
      </div>

      <AddFriendForm onSendRequest={onSendRequest} />

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-4">
          {requests.map(({ request, user }) => (
            <div
              key={request.requestId}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onAccept(request.requestId)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={() => onReject(request.requestId)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}