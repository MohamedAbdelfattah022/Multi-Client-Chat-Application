import { useState } from "react";
import { Users, UserPlus, Search } from "lucide-react";
import { User } from "../../types";
import SearchInput from "../common/SearchInput";
import { AddFriend } from "./AddFriend";

interface FriendListProps {
	friends: User[];
	onFriendSelect: (friendId: number) => void;
}

export default function FriendList({
	friends,
	onFriendSelect,
}: FriendListProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [showAddFriend, setShowAddFriend] = useState(false);

	const filteredFriends = friends.filter(
		(friend) =>
			friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			friend.email.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="h-full bg-white">
			<div className="flex flex-col h-full">
				{/* Search Bar */}
				<div className="p-4 border-b">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						<SearchInput
							value={searchQuery}
							onChange={setSearchQuery}
							placeholder="Search friends"
						/>
					</div>
				</div>

				{/* Add Friend Form */}
				{showAddFriend && <AddFriend />}

				{/* Friends List */}
				<div className="flex-1 overflow-y-auto">
					{filteredFriends.map((friend) => (
						<button
							key={friend.userId}
							onClick={() => onFriendSelect(friend.userId)}
							className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors border-b"
						>
							<div className="relative">
								<img
									src={
										friend.profilePic ||
										`https://ui-avatars.com/api/?name=${encodeURIComponent(
											friend.name
										)}`
									}
									alt={friend.name}
									className="w-12 h-12 rounded-full object-cover"
								/>
								<span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
							</div>
							<div className="ml-4 flex-1 min-w-0">
								<div className="flex items-center justify-between">
									<h3 className="font-medium text-gray-900 truncate">
										{friend.name}
									</h3>
									<span className="text-sm text-gray-500">Online</span>
								</div>
							</div>
						</button>
					))}

					{filteredFriends.length === 0 && (
						<div className="flex flex-col items-center justify-center h-full text-center p-4">
							<Users className="h-12 w-12 text-gray-400 mb-2" />
							<p className="text-gray-600">No friends found</p>
						</div>
					)}
				</div>

				{/* Add Friend Button */}
				<div className="p-4 border-t">
					<button
						onClick={() => setShowAddFriend(!showAddFriend)}
						className="w-full flex items-center justify-center gap-2 p-3 bg-indigo-600 text-white rounded-lg
                        hover:bg-indigo-700 transition-colors"
					>
						<UserPlus className="h-5 w-5" />
						{showAddFriend ? "Close" : "Add New Friend"}
					</button>
				</div>
			</div>
		</div>
	);
}
