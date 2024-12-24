import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:5271/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// Auth APIs
export const register = async (formData: RegisterDto) => {
	const response = await api.post("/auth/register", formData);
	return response.data;
};

export const login = async (loginData: LoginDto) => {
	const response = await api.post("/auth/login", loginData);
	return response.data;
};

// Friendship APIs
export const sendFriendRequest = async (requestDto: FriendRequestDto) => {
	const response = await api.post("/friendship/sendRequest", requestDto, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	return response.data;
};

export const respondToFriendRequest = async (
	actionDto: FriendRequestActionDto
) => {
	const response = await api.post("/friendship/respondToRequest", actionDto, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	return response.data;
};

export const getFriends = async (id: number) => {
	const response = await api.get(`/friendship/getFriends/${id}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	return response.data;
};

// Messages APIs
export const sendPrivateMessage = async (messageDto: SendMessageDto) => {
	const response = await api.post("/messages/sendPrivateMessage", messageDto, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	return response.data;
};

export const getPrivateMessages = async (messagesDto: GetMessagesDto) => {
	const response = await api.get("/messages/getPrivateMessages", {
		params: messagesDto,
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	return response.data;
};

export const updatePrivateMessage = async (
	messageId: number,
	updateMessageDto: UpdateMessageDto
) => {
	const response = await api.patch(
		`/messages/updatePrivateMessage/${messageId}`,
		updateMessageDto,
		{
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		}
	);
	return response.data;
};

export const deletePrivateMessage = async (messageId: number) => {
	const response = await api.delete(
		`/messages/deletePrivateMessage/${messageId}`,
		{
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		}
	);
	return response.data;
};

// Group APIs
export const sendGroupMessage = async (messageDto: SendGroupMessageDto) => {
	const response = await api.post("/Group/sendGroupMessage", messageDto, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	return response.data;
};

export const getGroupMessages = async (messagesDto: GetGroupMessagesDto) => {
	const response = await api.get("/Group/getGroupMessages", {
		params: messagesDto,
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	return response.data;
};

export const createGroup = async (createGroupDto: CreateGroupDto) => {
	const response = await api.post("/Group/createGroup", createGroupDto, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	return response.data;
};

export const addGroupMembers = async (addMembersDto: AddGroupMembersDto) => {
	const response = await api.post("/Group/addGroupMembers", addMembersDto, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	return response.data;
};

export const getGroupMembers = async (groupId: number) => {
	const response = await api.get(`/Group/getGroupMembers/${groupId}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	return response.data;
};

export const deleteGroupMember = async (
	deleteMemberDto: AddGroupMembersDto
) => {
	const response = await api.delete("/Group/deleteMember", {
		data: deleteMemberDto,
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	return response.data;
};

export const updateGroupMessage = async (
	messageId: number,
	updateMessageDto: UpdateMessageDto
) => {
	const response = await api.patch(
		`/Group/updateGroupMessage/${messageId}`,
		updateMessageDto,
		{
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		}
	);
	return response.data;
};

export const deleteGroupMessage = async (messageId: number) => {
	const response = await api.delete(`/Group/deleteGroupMessage/${messageId}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	return response.data;
};

export interface AddGroupMembersDto {
	adminId: number;
	groupId: number;
	userIds: number[];
}

export interface CreateGroupDto {
	groupName: string;
	description?: string | null;
	avatar?: string | null;
	adminId: number;
	participantIds: number[];
}

export interface FriendRequestActionDto {
	requestId: number;
	accept: boolean;
	currentUserId: number;
}

export interface FriendRequestDto {
	senderId: number;
	recipientEmail: string;
}

export interface LoginDto {
	email: string;
	password: string;
}

export interface RegisterDto {
	fullName: string;
	email: string;
	password: string;
}

export interface SendGroupMessageDto {
	senderId: number;
	groupId: number;
	messageContent: string;
	imageContent?: string;
}

export interface GetGroupMessagesDto {
	senderId: number;
	groupId: number;
}

export interface SendMessageDto {
	senderId: number;
	recipientId: number;
	messageContent: string;
	imageContent?: string;
}
export interface GetMessagesDto {
	senderId: number;
	recipientId: number;
}

export interface UpdateMessageDto {
	messageContent?: string;
	imageContent?: string | null;
}
