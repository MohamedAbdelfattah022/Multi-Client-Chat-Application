import { create } from "zustand";
import api from "../lib/axios";
import { useAuthStore } from "./authStore";

interface FriendRequest {
	requestId: number;
	senderId: number;
	senderName: string;
	senderEmail: string;
	status: string;
}

interface FriendStore {
	pendingRequests: FriendRequest[];
	sendFriendRequest: (
		senderId: number,
		recipientEmail: string
	) => Promise<void>;
	acceptRequest: (
		requestId: number,
		accept: boolean,
		currentUserId: number
	) => Promise<void>;
	rejectRequest: (
		requestId: number,
		accept: boolean,
		currentUserId: number
	) => Promise<void>;
	loadPendingRequests: () => Promise<void>;
}

export const useFriendStore = create<FriendStore>((set) => ({
	pendingRequests: [],

	sendFriendRequest: async (senderId: number, recipientEmail: string) => {
		try {
			await api.post("/Friendship/sendRequest", { senderId, recipientEmail });
		} catch (error) {
			console.error("Failed to send friend request:", error);
			throw error;
		}
	},

	acceptRequest: async (
		requestId: number,
		accept: boolean,
		currentUserId: number
	) => {
		const { userId } = useAuthStore.getState();
		try {
			await api.post("/Friendship/respondToRequest", {
				requestId,
				accept: true,
				currentUserId: userId,
			});
			set((state) => ({
				pendingRequests: state.pendingRequests.filter(
					(req) => req.requestId !== requestId
				),
			}));
		} catch (error) {
			console.error("Failed to accept friend request:", error);
			throw error;
		}
	},

	rejectRequest: async (
		requestId: number,
		accept: boolean,
		currentUserId: number
	) => {
		const { userId } = useAuthStore.getState();
		try {
			await api.post("/Friendship/respondToRequest", {
				requestId,
				accept: false,
				currentUserId: userId,
			});
			set((state) => ({
				pendingRequests: state.pendingRequests.filter(
					(req) => req.requestId !== requestId
				),
			}));
		} catch (error) {
			console.error("Failed to reject friend request:", error);
			throw error;
		}
	},

	loadPendingRequests: async () => {
		const { userId } = useAuthStore.getState();

		try {
			const response = await api.get<FriendRequest[]>(
				`/Friendship/getReceivedRequests/${userId}`
			);
			set({ pendingRequests: response.data });
		} catch (error) {
			console.error("Failed to load pending requests:", error);
			throw error;
		}
	},
}));
