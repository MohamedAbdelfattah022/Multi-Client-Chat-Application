import React, { useState } from "react";
import Navigation from "./components/layout/Navigation";
import ChatList from "./components/chat/ChatList";
import ChatWindow from "./components/chat/ChatWindow";
import GroupList from "./components/groups/GroupList";
import GroupChat from "./components/groups/GroupChat";
import FriendRequestList from "./components/friends/FriendRequestList";
import LoginForm from "./components/auth/LoginForm";
import { User, Message, Group, FriendRequest } from "./types";

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [activeTab, setActiveTab] = useState<
		"chats" | "groups" | "requests" | "settings"
	>("chats");
	const [activeChat, setActiveChat] = useState<User | null>(null);
	const [activeGroup, setActiveGroup] = useState<Group | null>(null);

	// Mock data for demonstration
	const mockUser: User = {
		userId: 1,
		name: "John Doe",
		email: "john@example.com",
		createdAt: new Date(),
	};

	const mockContacts: User[] = [
		{
			userId: 2,
			name: "Jane Smith",
			email: "jane@example.com",
			createdAt: new Date(),
		},
		{
			userId: 3,
			name: "Alice Johnson",
			email: "alice@example.com",
			createdAt: new Date(),
		},
	];

	// Mock messages with both private and group messages
	const mockMessages: Message[] = [
		{
			messageId: 1,
			senderId: 1,
			recipientId: 2,
			messageContent: "Hey, how are you?",
			sentAt: new Date(Date.now() - 3600000),
		},
		{
			messageId: 2,
			senderId: 2,
			recipientId: 1,
			messageContent: "I'm doing great! How about you?",
			sentAt: new Date(Date.now() - 3000000),
		},
		{
			messageId: 3,
			senderId: 1,
			groupId: 1,
			messageContent: "Hello team!",
			sentAt: new Date(Date.now() - 2400000),
		},
	];

	const mockChats = mockContacts.map((contact) => ({
		user: contact,
		lastMessage:
			mockMessages.find(
				(m) =>
					(m.senderId === contact.userId &&
						m.recipientId === mockUser.userId) ||
					(m.senderId === mockUser.userId && m.recipientId === contact.userId)
			) || mockMessages[0],
		unreadCount: 1,
	}));

	const [groups, setGroups] = useState<Group[]>([
		{
			groupId: 1,
			groupName: "Project Team",
			createdAt: new Date(),
			members: [
				{
					groupMemberId: 1,
					groupId: 1,
					userId: 1,
					joinedAt: new Date(),
					isAdmin: true,
				},
				{ groupMemberId: 2, groupId: 1, userId: 2, joinedAt: new Date() },
			],
			description: "Team discussion group",
		},
	]);

	const mockRequests: Array<{ request: FriendRequest; user: User }> = [
		{
			request: {
				requestId: 1,
				senderId: 3,
				recipientId: 1,
				status: "pending",
				createdAt: new Date(),
			},
			user: {
				userId: 3,
				name: "Alice Johnson",
				email: "alice@example.com",
				createdAt: new Date(),
			},
		},
	];

	const handleCreateGroup = (
		name: string,
		description: string,
		members: number[]
	) => {
		const newGroup: Group = {
			groupId: groups.length + 1,
			groupName: name,
			description,
			createdAt: new Date(),
			members: [
				{
					groupMemberId: 1,
					groupId: groups.length + 1,
					userId: currentUser!.userId,
					joinedAt: new Date(),
					isAdmin: true,
				},
				...members.map((userId, index) => ({
					groupMemberId: index + 2,
					groupId: groups.length + 1,
					userId,
					joinedAt: new Date(),
				})),
			],
		};
		setGroups([...groups, newGroup]);
		setActiveGroup(newGroup);
	};

	const handleChatSelect = (userId: number) => {
		const selectedUser = mockContacts.find(
			(contact) => contact.userId === userId
		);
		setActiveChat(selectedUser || null);
	};

	const handleGroupSelect = (groupId: number) => {
		const selectedGroup = groups.find((group) => group.groupId === groupId);
		setActiveGroup(selectedGroup || null);
	};

	const getFilteredMessages = (type: "chat" | "group", id: number) => {
		return mockMessages.filter((message) => {
			if (type === "chat") {
				return (
					(message.senderId === id &&
						message.recipientId === mockUser?.userId) ||
					(message.senderId === mockUser?.userId && message.recipientId === id)
				);
			} else {
				return message.groupId === id;
			}
		});
	};

	const handleLogin = (email: string, password: string) => {
		setCurrentUser(mockUser);
		setIsAuthenticated(true);
	};

	if (!isAuthenticated) {
		return <LoginForm onLogin={handleLogin} onSwitchToRegister={() => {}} />;
	}

	return (
		<div className="flex h-screen bg-white">
			<Navigation
				activeTab={activeTab}
				onTabChange={(tab) => {
					setActiveTab(tab);
					setActiveChat(null);
					setActiveGroup(null);
				}}
				onLogout={() => setIsAuthenticated(false)}
			/>
			{activeTab === "chats" && (
				<>
					<ChatList
						chats={mockChats}
						contacts={mockContacts}
						onChatSelect={handleChatSelect}
					/>
					{activeChat ? (
						<ChatWindow
							currentUser={mockUser}
							recipient={activeChat}
							messages={getFilteredMessages("chat", activeChat.userId)}
							onSendMessage={(content) => {
								console.log("Sending message:", content);
							}}
							onEditMessage={(messageId, content) => {
								console.log("Editing message:", messageId, content);
							}}
							onDeleteMessage={(messageId) => {
								console.log("Deleting message:", messageId);
							}}
						/>
					) : (
						<div className="flex-1 flex items-center justify-center bg-gray-50">
							<div className="text-center">
								<h3 className="text-lg font-medium text-gray-900">
									Welcome to Chat
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									Select a conversation to start messaging
								</p>
							</div>
						</div>
					)}
				</>
			)}

			{activeTab === "groups" && (
				<>
					<GroupList
						groups={groups}
						contacts={mockContacts}
						onGroupSelect={handleGroupSelect}
						onCreateGroup={handleCreateGroup}
					/>
					{activeGroup ? (
						<GroupChat
							group={activeGroup}
							messages={getFilteredMessages("group", activeGroup.groupId)}
							currentUser={mockUser}
							onSendMessage={(content, groupId) => {
								console.log("Sending group message:", content, groupId);
							}}
							onAddMember={() => {}}
							onOpenSettings={() => {}}
						/>
					) : (
						<div className="flex-1 flex items-center justify-center bg-gray-50">
							<div className="text-center">
								<h3 className="text-lg font-medium text-gray-900">
									Welcome to Groups
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									Select a group to start messaging
								</p>
							</div>
						</div>
					)}
				</>
			)}
			{activeTab === "requests" && (
				<FriendRequestList
					requests={mockRequests}
					onAccept={(requestId) => {
						console.log("Accepting request:", requestId);
					}}
					onReject={(requestId) => {
						console.log("Rejecting request:", requestId);
					}}
					onSendRequest={(email) => {
						console.log("Sending friend request to:", email);
					}}
				/>
			)}
		</div>
	);
}

export default App;
