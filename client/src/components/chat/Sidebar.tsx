import React, { useState, useEffect } from "react";
import { Users, MessageSquare, LogOut, Bell } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useChatStore } from "../../stores/chatStore";
import { useFriendStore } from "../../stores/friendStore";
import { Button } from "../ui/Button";
// import { AddFriend } from "../friends/AddFriend";
import { FriendRequests } from "../friends/FriendRequests";
import GroupList from "../groups/GroupList";
import { createGroup } from "../../services/api";
import FriendList from "../friends/FriendList";

export const Sidebar: React.FC = () => {
	const [activeTab, setActiveTab] = useState<"friends" | "groups">("friends");
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

	const { loadGroups } = useChatStore();

	const handleCreateGroup = async (
		name: string,
		description: string,
		members: number[]
	) => {
		const { userId } = useAuthStore.getState();
		if (!userId) return;

		try {
			await createGroup({
				groupName: name,
				description: description,
				adminId: Number(userId),
				participantIds: members,
			});
			await loadGroups();
		} catch (error) {
			console.error("Failed to create group:", error);
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
			{/* {showAddFriend && <AddFriend />} */}

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
					<FriendList
						friends={friends}
						onFriendSelect={(friendId) => setSelectedChat("private", friendId)}
						// onAddFriend={() => setShowAddFriend(true)}
					/>
				) : (
					<GroupList
						groups={groups}
						contacts={friends}
						onGroupSelect={(groupId) => setSelectedChat("group", groupId)}
						onCreateGroup={handleCreateGroup}
					/>
				)}
			</div>
		</div>
	);
};
