import { create } from "zustand";
import api from "../lib/axios";
import type { Message, User, Group } from "../types";
import { useAuthStore } from "./authStore";
import { signalRService } from "../services/SignalRService";

interface ChatState {
	friends: User[];
	groups: Group[];
	privateMessages: Record<number, Message[]>;
	groupMessages: Record<number, Message[]>;
	selectedChat: { type: "private" | "group"; id: number } | null;
	loadFriends: () => Promise<void>;
	loadGroups: () => Promise<void>;
	loadPrivateMessages: (recipientId: number) => Promise<void>;
	loadGroupMessages: (groupId: number) => Promise<void>;
	sendPrivateMessage: (
		recipientId: number,
		content: string,
		image?: File
	) => Promise<void>;
	sendGroupMessage: (
		groupId: number,
		content: string,
		image?: File
	) => Promise<void>;
	setSelectedChat: (type: "private" | "group", id: number) => void;
	addFriend: (friendId: number) => Promise<void>;
	initializeSignalR: (userId: string) => Promise<void>;
	disconnectSignalR: (userId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
	initializeSignalR: async (userId: string) => {
		await signalRService.start(userId.toString());

		signalRService.onMessage((message) => {
			const state = get();
			if (message.senderId && message.recipientId) {
				const chatId =
					message.senderId === Number(userId)
						? message.recipientId
						: message.senderId;

				const existingMessages = state.privateMessages[chatId] || [];
				if (!existingMessages.some((m) => m.messageId === message.messageId)) {
					set({
						privateMessages: {
							...state.privateMessages,
							[chatId]: [...existingMessages, message],
						},
					});
				}
			}
		});
	},

	disconnectSignalR: async (userId: string) => {
		await signalRService.stop(userId);
	},

	friends: [],
	groups: [],
	privateMessages: {},
	groupMessages: {},
	selectedChat: null,

	loadFriends: async () => {
		const { userId } = useAuthStore.getState();
		if (!userId) return;

		try {
			const response = await api.get<User[]>(
				`/Friendship/getFriends/${userId}`
			);
			set({ friends: response.data });
		} catch (error) {
			console.error("Failed to load friends:", error);
		}
	},
	loadGroups: async () => {
		const { userId } = useAuthStore.getState();
		if (!userId) return;

		try {
			const response = await api.get<Group[]>(`/Group/getUserGroups/${userId}`);
			set({ groups: response.data });
		} catch (error) {
			console.error("Failed to load groups:", error);
		}
	},

	loadPrivateMessages: async (recipientId: number) => {
		const { userId } = useAuthStore.getState();
		if (!userId) return;

		try {
			const response = await api.get<Message[]>(
				"/Messages/getPrivateMessages",
				{
					params: { SenderId: userId, RecipientId: recipientId },
				}
			);
			set((state) => ({
				privateMessages: {
					...state.privateMessages,
					[recipientId]: response.data,
				},
			}));
		} catch (error) {
			console.error("Failed to load private messages:", error);
		}
	},

	loadGroupMessages: async (groupId: number) => {
		const { userId } = useAuthStore.getState();
		if (!userId) return;

		try {
			const response = await api.get<Message[]>("/Group/getGroupMessages", {
				params: { GroupId: groupId, SenderId: userId },
			});
			set((state) => ({
				groupMessages: {
					...state.groupMessages,
					[groupId]: response.data,
				},
			}));
		} catch (error) {
			console.error("Failed to load group messages:", error);
		}
	},

	sendPrivateMessage: async (
		recipientId: number,
		content: string,
		image?: File
	) => {
		const { userId } = useAuthStore.getState();
		if (!userId) return;

		const formData = new FormData();
		formData.append("senderId", userId.toString());
		formData.append("recipientId", String(recipientId));
		formData.append("messageContent", content);
		if (image) {
			formData.append("imageContent", image);
		}

		try {
			await api.post("/Messages/sendPrivateMessage", formData, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			// await get().loadPrivateMessages(recipientId);
		} catch (error) {
			console.error("Failed to send private message:", error);
		}
	},

	sendGroupMessage: async (groupId: number, content: string, image?: File) => {
		const { userId } = useAuthStore.getState();
		if (!userId) return;

		const formData = new FormData();
		formData.append("senderId", userId);
		formData.append("groupId", String(groupId));
		formData.append("messageContent", content);
		if (image) {
			formData.append("imageContent", image);
		}

		try {
			await api.post("/Group/sendGroupMessage", formData);
			// await get().loadGroupMessages(groupId);
		} catch (error) {
			console.error("Failed to send group message:", error);
		}
	},

	setSelectedChat: (type: "private" | "group", id: number) => {
		const { userId } = useAuthStore.getState();
		if (!userId) return;
		if (type === "private") {
			signalRService.initializePrivateChat(userId.toString(), id.toString());
		}
		set({ selectedChat: { type, id } });
	},

	addFriend: async (friendId: number) => {
		const { userId } = useAuthStore.getState();
		if (!userId) return;

		try {
			await api.post("/Friendship/addFriend", {
				userId: userId,
				friendId: friendId,
			});
			await get().loadFriends(); // Reload friends list after adding
		} catch (error) {
			console.error("Failed to add friend:", error);
		}
	},
}));
