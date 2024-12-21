import React, { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../services/api";

interface LoginFormProps {
	onLogin: (email: string, password: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const token = await authApi.login(email, password);
			localStorage.setItem("token", token);
			onLogin(email, password);
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	const handleSignupRedirect = () => {
		navigate("/signup");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
			<div className="max-w-md w-full mx-4">
				<div className="bg-white rounded-2xl shadow-xl p-8">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Welcome back
						</h1>
						<p className="text-gray-600">Sign in to continue to your account</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Email address
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Mail className="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl 
                    text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 
                    focus:ring-indigo-500 focus:border-transparent transition-all"
										placeholder="Enter your email"
										required
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Lock className="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl 
                    text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 
                    focus:ring-indigo-500 focus:border-transparent transition-all"
										placeholder="Enter your password"
										required
									/>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<button
								type="button"
								className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
							>
								Forgot password?
							</button>
						</div>

						<button
							type="submit"
							className="w-full flex items-center justify-center px-4 py-3 border border-transparent 
              text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
              transition-colors"
						>
							Sign in
							<ArrowRight className="ml-2 h-5 w-5" />
						</button>
					</form>

					<div className="mt-6 text-center">
						<button
							onClick={handleSignupRedirect}
							className="text-base text-gray-600 hover:text-indigo-600 transition-colors"
						>
							Don't have an account?{" "}
							<span className="font-semibold">Sign up</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
