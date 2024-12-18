import React from 'react';
import { User } from '../../types';

interface AvatarProps {
  user: User;
  size?: number;
  className?: string;
}

export default function Avatar({ user, size = 10, className = '' }: AvatarProps) {
  return (
    <img
      src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
      alt={user.name}
      className={`w-${size} h-${size} rounded-full ${className}`}
    />
  );
}