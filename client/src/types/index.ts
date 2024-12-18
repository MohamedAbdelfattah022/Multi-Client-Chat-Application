export interface User {
	userId: number;
	name: string;
	email: string;
	profilePic?: string;
	createdAt: Date;
	status?: "online" | "offline" | "away";
}

export interface Message {
	messageId: number;
	senderId: number;
	recipientId?: number;
	groupId?: number;
	messageContent: string;
	imageContent?: Blob;
	sentAt: string;
}

export interface Group {
	groupId: number;
	groupName: string;
	createdAt: Date;
	members: GroupMember[];
	description?: string;
	avatar?: string;
}

export interface GroupMember {
	groupMemberId: number;
	groupId: number;
	userId: number;
	joinedAt: Date;
	isAdmin?: boolean;
}

export interface FriendRequest {
	requestId: number;
	senderId: number;
	recipientId: number;
	status: "pending" | "accepted" | "rejected";
	createdAt: Date;
}
