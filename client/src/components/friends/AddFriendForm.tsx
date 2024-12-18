import React, { useState } from "react";
import { UserPlus, Mail, Search } from "lucide-react";

interface AddFriendFormProps {
	onSendRequest: (email: string) => void;
}

export default function AddFriendForm({ onSendRequest }: AddFriendFormProps) {
	const [email, setEmail] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (email.trim()) {
			onSendRequest(email.trim());
			setEmail("");
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<div className="mb-6 text-center">
				<h2 className="text-2xl font-bold text-gray-800">
					Connect with Friends
				</h2>
				<p className="text-gray-600 mt-2">
					Send a friend request using email address
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="relative group">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
						<Mail className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
					</div>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="friend@example.com"
						className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl 
                     text-gray-900 placeholder-gray-400 
                     transition-all duration-200
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 
                     hover:border-indigo-300"
					/>
					<div className="absolute inset-y-0 right-0 pr-4 flex items-center">
						<Search className="h-5 w-5 text-gray-400 hover:text-indigo-500 cursor-pointer transition-colors" />
					</div>
				</div>

				<button
					type="submit"
					className="w-full flex justify-center items-center px-6 py-3 
                   bg-gradient-to-r from-indigo-600 to-indigo-700
                   hover:from-indigo-700 hover:to-indigo-800
                   text-white font-medium rounded-xl
                   transform transition-all duration-200
                   hover:scale-[1.02] active:scale-[0.98]
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					<UserPlus className="h-5 w-5 mr-2" />
					<span>Send Friend Request</span>
				</button>
			</form>

			<div className="mt-6 text-center">
				<p className="text-sm text-gray-500">
					Your friend will receive an email notification
				</p>
			</div>
		</div>
	);
}
