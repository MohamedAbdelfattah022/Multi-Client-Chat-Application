import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import api from "../lib/axios";
import type { AuthResponse } from "../types";

interface AuthState {
	token: string | null;
	userId: string | null;
	email: string | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (
		fullName: string,
		email: string,
		password: string
	) => Promise<void>;
	logout: () => void;
}
export const useAuthStore = create<AuthState>((set) => {
	const token = localStorage.getItem("token");
	let userId = null;
	let email = null;

	if (token) {
		const decoded = jwtDecode<AuthResponse>(token);
		userId = decoded.UserId;
		email = decoded.email;
	}

	return {
		token,
		userId,
		email,
		isAuthenticated: !!token,

		login: async (email: string, password: string) => {
			try {
				const response = await api.post<string>("/Auth/login", {
					email,
					password,
				});
				const token = response.data;
				const decoded = jwtDecode<AuthResponse>(token);

				localStorage.setItem("token", token);
				set({
					token,
					userId: decoded.UserId,
					email: decoded.email,
					isAuthenticated: true,
				});
			} catch (error) {
				throw new Error("Invalid email or password");
			}
		},

		register: async (fullName: string, email: string, password: string) => {
			try {
				await api.post("/Auth/register", { fullName, email, password });
			} catch (error) {
				throw new Error("Registration failed");
			}
		},

		logout: () => {
			localStorage.removeItem("token");
			set({
				token: null,
				userId: null,
				email: null,
				isAuthenticated: false,
			});
		},
	};
});
