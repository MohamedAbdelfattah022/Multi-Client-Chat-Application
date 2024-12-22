export interface User {
	userId: number;
	name: string;
	email: string;
	profilePic: string | null;
}

export interface Message {
	messageId: number;
	senderId: number;
	senderName: string;
	recipientId?: number;
	recipientName?: string;
	groupId?: number;
	groupName?: string;
	messageContent: string;
	imageContent?: string;
	sentAt: string;
}

export interface Group {
	groupId: number;
	groupName: string;
	description: string | null;
	avatar: string | null;
	createdAt: string;
}

export interface AuthResponse {
	email: string;
	TokenId: string;
	UserId: string;
	nbf: number;
	exp: number;
	iat: number;
	iss: string;
	aud: string;
}

export interface FriendRequest {
	requestId: number;
	senderId: number;
	senderName: string;
	senderEmail: string;
	senderProfilePic: string | null;
	createdAt: string;
}
