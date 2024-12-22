import React, { useState, useEffect } from "react";
import { Users, UserPlus, MessageSquare, LogOut, Bell } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useChatStore } from "../../stores/chatStore";
import { useFriendStore } from "../../stores/friendStore";
import { Button } from "../ui/Button";
import { AddFriend } from "../friends/AddFriend";
import { FriendRequests } from "../friends/FriendRequests";

export const Sidebar: React.FC = () => {
	const [activeTab, setActiveTab] = useState<"friends" | "groups">("friends");
	const [showAddFriend, setShowAddFriend] = useState(false);
	const [showFriendRequests, setShowFriendRequests] = useState(false);
	const { friends, groups, setSelectedChat } = useChatStore();
	const { userId } = useAuthStore();
	const { pendingRequests, loadPendingRequests } = useFriendStore();
	const logout = useAuthStore((state) => state.logout);

	useEffect(() => {
		if (userId) {
			loadPendingRequests();
		}
	}, [userId, loadPendingRequests]);

	const handleAddButtonClick = () => {
		if (activeTab === "friends") {
			setShowAddFriend(!showAddFriend);
		} else {
			// Handle group creation
			console.log("Create group clicked");
		}
	};

	return (
		<div className="flex h-full w-80 flex-col border-r bg-white">
			<div className="flex items-center justify-between border-b p-4">
				<h1 className="text-xl font-semibold">Chat</h1>
				<div className="flex items-center space-x-2">
					<Button
						variant="secondary"
						size="sm"
						onClick={() => setShowFriendRequests(!showFriendRequests)}
						className="relative p-2"
					>
						<Bell className="h-5 w-5" />
						{pendingRequests.length > 0 && (
							<span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
								{pendingRequests.length}
							</span>
						)}
					</Button>
					<Button
						variant="secondary"
						size="sm"
						onClick={logout}
						className="p-2"
					>
						<LogOut className="h-5 w-5" />
					</Button>
				</div>
			</div>

			{showFriendRequests && <FriendRequests />}
			{showAddFriend && <AddFriend />}

			<div className="flex border-b">
				<button
					className={`flex-1 p-4 text-sm font-medium ${
						activeTab === "friends"
							? "border-b-2 border-blue-500 text-blue-600"
							: "text-gray-500 hover:text-gray-700"
					}`}
					onClick={() => setActiveTab("friends")}
				>
					<Users className="mx-auto h-5 w-5" />
					Friends
				</button>
				<button
					className={`flex-1 p-4 text-sm font-medium ${
						activeTab === "groups"
							? "border-b-2 border-blue-500 text-blue-600"
							: "text-gray-500 hover:text-gray-700"
					}`}
					onClick={() => setActiveTab("groups")}
				>
					<MessageSquare className="mx-auto h-5 w-5" />
					Groups
				</button>
			</div>

			<div className="flex-1 overflow-y-auto">
				{activeTab === "friends" ? (
					<div className="space-y-2 p-4">
						{friends.map((friend) => (
							<button
								key={friend.userId}
								className="flex w-full items-center rounded-lg p-2 hover:bg-gray-100"
								onClick={() => setSelectedChat("private", friend.userId)}
							>
								<div className="h-10 w-10 rounded-full bg-gray-300">
									{friend.profilePic ? (
										<img
											src={friend.profilePic}
											alt={friend.name}
											className="h-full w-full rounded-full object-cover"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center">
											<Users className="h-6 w-6 text-gray-500" />
										</div>
									)}
								</div>
								<span className="ml-3 text-sm font-medium">{friend.name}</span>
							</button>
						))}
					</div>
				) : (
					<div className="space-y-2 p-4">
						{groups.map((group) => (
							<button
								key={group.groupId}
								className="flex w-full items-center rounded-lg p-2 hover:bg-gray-100"
								onClick={() => setSelectedChat("group", group.groupId)}
							>
								<div className="h-10 w-10 rounded-full bg-gray-300">
									{group.avatar ? (
										<img
											src={group.avatar}
											alt={group.groupName}
											className="h-full w-full rounded-full object-cover"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center">
											<MessageSquare className="h-6 w-6 text-gray-500" />
										</div>
									)}
								</div>
								<span className="ml-3 text-sm font-medium">
									{group.groupName}
								</span>
							</button>
						))}
					</div>
				)}
			</div>

			<div className="border-t p-4">
				<Button className="w-full" onClick={handleAddButtonClick}>
					{/* <UserPlus className="mr-2 h-5 w-5" /> */}
					{activeTab === "friends" ? "Add Friend" : "Create Group"}
				</Button>
			</div>
		</div>
	);
};
