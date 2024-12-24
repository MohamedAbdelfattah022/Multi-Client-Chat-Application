import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useAuthStore } from "../../stores/authStore";
import { toast } from "react-hot-toast";

interface RegisterFormData {
	fullName: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export const RegisterForm: React.FC = () => {
	const navigate = useNavigate();
	const register = useAuthStore((state) => state.register);
	const {
		register: registerField,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormData>();

	const password = watch("password");

	const onSubmit = async (data: RegisterFormData) => {
		try {
			await register(data.fullName, data.email, data.password);
			toast.success("Account created successfully! Please log in.");
			navigate("/login");
		} catch (error: unknown) {
			if (
				error instanceof Error &&
				"response" in error &&
				typeof error.response === "object" &&
				error.response &&
				"status" in error.response
			) {
				if (error.response.status === 409) {
					toast.error("Email already exists. Please use a different email.");
				} else {
					toast.error("Registration failed. Please try again.");
				}
			} else {
				toast.error("Registration failed. Please try again.");
			}
			console.error("Registration failed:", error);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-150">
			<div className="max-w-md w-full mx-4">
				<div className="bg-white rounded-2xl shadow-xl p-8">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Create Account
						</h1>
						<p className="text-gray-600">Join our chat community today</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Full Name
								</label>
								<div className="relative">
									<User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
									<Input
										{...registerField("fullName", {
											required: "Full name is required",
											minLength: {
												value: 2,
												message: "Name must be at least 2 characters",
											},
										})}
										placeholder="Enter your full name"
										className="pl-10 pr-3 py-3 w-full rounded-xl border-gray-300 focus:red-500"
										error={errors.fullName?.message}
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Email address
								</label>
								<div className="relative">
									<Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
									<Input
										{...registerField("email", {
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
										{...registerField("password", {
											required: "Password is required",
											minLength: {
												value: 6,
												message: "Password must be at least 6 characters",
											},
										})}
										type="password"
										placeholder="Create a password"
										className="pl-10 pr-3 py-3 w-full rounded-xl border-gray-300 focus:red-500"
										error={errors.password?.message}
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Confirm Password
								</label>
								<div className="relative">
									<Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
									<Input
										{...registerField("confirmPassword", {
											required: "Please confirm your password",
											validate: (value) =>
												value === password || "Passwords do not match",
										})}
										type="password"
										placeholder="Confirm your password"
										className="pl-10 pr-3 py-3 w-full rounded-xl border-gray-300 focus:red-500"
										error={errors.confirmPassword?.message}
									/>
								</div>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full flex items-center justify-center px-4 py-3 border border-transparent 
                text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:red-500 
                transition-colors"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Creating account..." : "Create account"}
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-base text-gray-600">
							Already have an account?{" "}
							<button
								onClick={() => navigate("/login")}
								className="font-semibold text-indigo-600 hover:text-indigo-500"
							>
								Sign in
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
