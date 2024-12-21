const API_BASE_URL = 'http://localhost:5271/api';

export const authApi = {
	login: async (email: string, password: string) => {
		const response = await fetch(`${API_BASE_URL}/users/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});
		
		if (!response.ok) {
			const errorData = await response.text();
			throw new Error(errorData || 'Invalid credentials');
		}
		
		return response.text();
	},

	register: async (fullName: string, email: string, password: string) => {
		const response = await fetch(`${API_BASE_URL}/users/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ fullName, email, password }),
		});

		if (!response.ok) {
			const errorData = await response.text();
			throw new Error(errorData || 'Registration failed');
		}

		return response.text();
	},
};
export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};
