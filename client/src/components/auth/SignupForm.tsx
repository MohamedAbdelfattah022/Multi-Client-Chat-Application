import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { authApi } from "../../services/api";

interface SignupFormProps {
	onSignup: (name: string, email: string, password: string) => void;
	onSwitchToLogin: () => void;
}

export default function SignupForm({
	onSignup,
	onSwitchToLogin,
}: SignupFormProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const validatePasswords = () => {
		if (password !== confirmPassword) {
			setPasswordError("Passwords do not match");
			return false;
		}
		if (password.length < 8) {
			setPasswordError("Password must be at least 8 characters long");
			return false;
		}
		setPasswordError("");
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (validatePasswords()) {
			try {
				await authApi.register(name, email, password);
				onSignup(name, email, password);
			} catch (error) {
				// Handle error appropriately
				console.error("Registration failed:", error);
			}
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
			<div className="max-w-md w-full mx-4">
				<div className="bg-white rounded-2xl shadow-xl p-8">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Create Account
						</h1>
						<p className="text-gray-600">Join our community today</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Full Name
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<User className="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
										className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl 
                    text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 
                    focus:ring-indigo-500 focus:border-transparent transition-all"
										placeholder="Enter your full name"
										required
									/>
								</div>
							</div>

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
										onChange={(e) => {
											setPassword(e.target.value);
											setPasswordError("");
										}}
										className={`block w-full pl-10 pr-3 py-3 border ${
											passwordError ? "border-red-500" : "border-gray-300"
										} rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 
										focus:ring-indigo-500 focus:border-transparent transition-all`}
										placeholder="Create a password"
										required
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Confirm Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Lock className="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="password"
										value={confirmPassword}
										onChange={(e) => {
											setConfirmPassword(e.target.value);
											setPasswordError("");
										}}
										className={`block w-full pl-10 pr-3 py-3 border ${
											passwordError ? "border-red-500" : "border-gray-300"
										} rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 
										focus:ring-indigo-500 focus:border-transparent transition-all`}
										placeholder="Confirm your password"
										required
									/>
								</div>
								{passwordError && (
									<p className="mt-2 text-sm text-red-600">{passwordError}</p>
								)}
							</div>
						</div>

						<button
							type="submit"
							onClick={onSwitchToLogin}
							className="w-full flex items-center justify-center px-4 py-3 border border-transparent 
              text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
              transition-colors"
						>
							Create Account
							<ArrowRight className="ml-2 h-5 w-5" />
						</button>
					</form>

					<div className="mt-6 text-center">
						<button
							onClick={onSwitchToLogin}
							className="text-base text-gray-600 hover:text-indigo-600 transition-colors"
						>
							Already have an account?{" "}
							<span className="font-semibold">Sign in</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
