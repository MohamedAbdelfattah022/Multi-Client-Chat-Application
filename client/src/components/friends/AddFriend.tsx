import React from "react";
import { useForm } from "react-hook-form";
import { UserPlus } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useFriendStore } from "../../stores/friendStore";
import { useAuthStore } from "../../stores/authStore";

interface AddFriendFormData {
	email: string;
}

export const AddFriend: React.FC = () => {
	const { userId } = useAuthStore();
	const { sendFriendRequest } = useFriendStore();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<AddFriendFormData>();

	const onSubmit = async (data: AddFriendFormData) => {
		try {
			await sendFriendRequest(Number(userId), data.email);
			reset();
		} catch (error) {}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
			<div>
				<Input
					{...register("email", {
						required: "Email is required",
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: "Invalid email address",
						},
					})}
					placeholder="Enter friend's email"
					error={errors.email?.message}
				/>
			</div>
			<Button type="submit" className="w-full" disabled={isSubmitting}>
				Send Friend Request
			</Button>
		</form>
	);
};
