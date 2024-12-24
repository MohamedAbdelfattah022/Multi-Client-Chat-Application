import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useAuthStore } from "../../stores/authStore";
import { toast } from "react-hot-toast"; // Add this import

interface LoginFormData {
	email: string;
	password: string;
}

export const LoginForm: React.FC = () => {
	const navigate = useNavigate();
	const login = useAuthStore((state) => state.login);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>();

	const onSubmit = async (data: LoginFormData) => {
		try {
			await login(data.email, data.password);
			toast.success("Successfully logged in!");
			navigate("/chat");
		} catch (error) {
			toast.error("Invalid email or password. Please try again.");
			console.error("Login failed:", error);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-150">
			<div className="max-w-md w-full mx-4">
				<div className="bg-white rounded-2xl shadow-xl p-8">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Welcome Back
						</h1>
						<p className="text-gray-600">Sign in to continue chatting</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Email address
								</label>
								<div className="relative">
									<Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
									<Input
										{...register("email", {
											required: "Email is required",
											pattern: {
												value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
												message: "Invalid email address",
											},
										})}
										type="email"
										placeholder="Enter your email"
										className="pl-10 pr-3 py-3 w-full rounded-xl border-gray-300 focus:red-500"
										error={errors.email?.message}
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Password
								</label>
								<div className="relative">
									<Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
									<Input
										{...register("password", {
											required: "Password is required",
											minLength: {
												value: 6,
												message: "Password must be at least 6 characters",
											},
										})}
										type="password"
										placeholder="Enter your password"
										className="pl-10 pr-3 py-3 w-full rounded-xl border-gray-300 focus:red-500"
										error={errors.password?.message}
									/>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="text-sm">
								<a
									href="#"
									className="font-medium text-indigo-600 hover:text-indigo-500"
								>
									Forgot password?
								</a>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full flex items-center justify-center px-4 py-3 border border-transparent 
                text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                transition-colors"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Signing in..." : "Sign in"}
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-base text-gray-600">
							Don't have an account?{" "}
							<button
								onClick={() => navigate("/register")}
								className="font-semibold text-indigo-600 hover:text-indigo-500"
							>
								Sign up
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
