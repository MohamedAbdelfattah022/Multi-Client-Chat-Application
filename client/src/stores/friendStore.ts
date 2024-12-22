import { create } from "zustand";
import api from "../lib/axios";

interface FriendRequest {
	requestId: number;
	senderId: number;
	senderName: string;
	senderEmail: string;
	status: string;
}

interface FriendStore {
	pendingRequests: FriendRequest[];
	sendFriendRequest: (userId: number, email: string) => Promise<void>;
	acceptRequest: (requestId: number) => Promise<void>;
	rejectRequest: (requestId: number) => Promise<void>;
	loadPendingRequests: () => Promise<void>;
}

export const useFriendStore = create<FriendStore>((set) => ({
	pendingRequests: [],

	sendFriendRequest: async (userId: number, email: string) => {
		try {
			await api.post("/Friendship/sendRequest", { userId, email });
		} catch (error) {
			console.error("Failed to send friend request:", error);
			throw error;
		}
	},

	acceptRequest: async (requestId: number) => {
		try {
			await api.post(`/Friendship/acceptRequest/${requestId}`);
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

	rejectRequest: async (requestId: number) => {
		try {
			await api.post(`/Friendship/rejectRequest/${requestId}`);
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
		try {
			const response = await api.get<FriendRequest[]>(
				"/Friendship/getPendingRequests"
			);
			set({ pendingRequests: response.data });
		} catch (error) {
			console.error("Failed to load pending requests:", error);
			throw error;
		}
	},
}));
