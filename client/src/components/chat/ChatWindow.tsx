import React, { useEffect, useRef, useState } from "react";
import { Send, Image, Info, Edit2, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useChatStore } from "../../stores/chatStore";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
	deleteGroupMessage,
	deletePrivateMessage,
	updateGroupMessage,
	updatePrivateMessage,
	getGroupMembers,
} from "../../services/api";
import { Group, User } from "../../types";
import { decryptMessage } from "../../utils/cryptoUtils";

interface MessageFormData {
	content: string;
	image?: FileList;
}

interface GroupInfoModalProps {
	isOpen: boolean;
	onClose: () => void;
	group: Group | undefined;
	members: Array<{
		userId: number;
		name: string;
		profilePic: string | null;
		isAdmin: boolean;
	}>;
}

const GroupInfoModal: React.FC<GroupInfoModalProps> = ({
	isOpen,
	onClose,
	group,
	members,
}) => {
	if (!isOpen || !group) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Group Info</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						<X className="h-6 w-6" />
					</button>
				</div>

				<div className="space-y-4">
					<div>
						<h3 className="font-medium mb-2">Group Name</h3>
						<p className="text-gray-600">{group.groupName}</p>
					</div>

					<div>
						<h3 className="font-medium mb-2">Members ({members.length})</h3>
						<div className="space-y-2">
							{members.map((member) => (
								<div
									key={member.userId}
									className="flex items-center space-x-2"
								>
									<img
										src={
											member.profilePic ||
											`https://ui-avatars.com/api/?name=${encodeURIComponent(
												member.name
											)}`
										}
										alt={member.name}
										className="w-8 h-8 rounded-full"
									/>
									<span>{member.name}</span>
									{member.isAdmin && (
										<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
											Admin
										</span>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const ChatWindow: React.FC = () => {
	const {
		selectedChat,
		privateMessages,
		groupMessages,
		sendPrivateMessage,
		sendGroupMessage,
		loadPrivateMessages,
		loadGroupMessages,
		initializeSignalR,
		disconnectSignalR,
		friends,
		groups,
	} = useChatStore();

	const { userId } = useAuthStore();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [showInfo, setShowInfo] = useState(false);
	const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
	const [editContent, setEditContent] = useState("");
	const [selectedImage, setSelectedImage] = useState<File | null>(null);

	const [groupMembers, setGroupMembers] = useState<
		Array<{
			userId: number;
			name: string;
			profilePic: string | null;
			isAdmin: boolean;
		}>
	>([]);

	useEffect(() => {
		const fetchGroupMembers = async () => {
			if (selectedChat?.type === "group") {
				const members = await getGroupMembers(selectedChat.id);
				setGroupMembers(members);
			}
		};
		fetchGroupMembers();
	}, [selectedChat]);

	const handleEditMessage = async (messageId: number, newContent: string) => {
		try {
			if (!selectedChat) return;

			const updateDto = { messageContent: newContent };

			if (selectedChat.type === "private") {
				await updatePrivateMessage(messageId, updateDto);
			} else {
				await updateGroupMessage(messageId, updateDto);
			}

			const messageMap =
				selectedChat.type === "private" ? privateMessages : groupMessages;
			const chatId = selectedChat.id;
			const updatedMessages = messageMap[chatId].map((msg) =>
				msg.messageId === messageId
					? { ...msg, messageContent: newContent }
					: msg
			);

			useChatStore.setState((state) => ({
				[selectedChat.type === "private" ? "privateMessages" : "groupMessages"]:
					{
						...state[
							selectedChat.type === "private"
								? "privateMessages"
								: "groupMessages"
						],
						[chatId]: updatedMessages,
					},
			}));

			setEditingMessageId(null);
			setEditContent("");
		} catch (error) {
			console.error("Failed to edit message:", error);
		}
	};

	const handleDeleteMessage = async (messageId: number) => {
		try {
			if (!selectedChat) return;

			if (selectedChat.type === "private") {
				await deletePrivateMessage(messageId);
			} else {
				await deleteGroupMessage(messageId);
			}

			const messageMap =
				selectedChat.type === "private" ? privateMessages : groupMessages;
			const chatId = selectedChat.id;
			const updatedMessages = messageMap[chatId].filter(
				(msg) => msg.messageId !== messageId
			);

			useChatStore.setState(
				(state: { privateMessages: any; groupMessages: any }) => ({
					[selectedChat.type === "private"
						? "privateMessages"
						: "groupMessages"]: {
						...state[
							selectedChat.type === "private"
								? "privateMessages"
								: "groupMessages"
						],
						[chatId]: updatedMessages,
					},
				})
			);
		} catch (error) {
			console.error("Failed to delete message:", error);
		}
	};

	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = useForm<MessageFormData>();

	useEffect(() => {
		if (userId) {
			initializeSignalR(userId);

			return () => {
				disconnectSignalR(userId);
			};
		}
	}, [userId, initializeSignalR, disconnectSignalR]);

	useEffect(() => {
		if (selectedChat) {
			if (selectedChat.type === "private") {
				loadPrivateMessages(selectedChat.id);
			} else {
				loadGroupMessages(selectedChat.id);
			}
		}
	}, [selectedChat, loadPrivateMessages, loadGroupMessages]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [privateMessages, groupMessages]);

	const onSubmit = async (data: MessageFormData) => {
		if (!selectedChat || (!data.content.trim() && !selectedImage)) return;

		try {
			if (selectedChat.type === "private") {
				await sendPrivateMessage(
					selectedChat.id,
					data.content,
					selectedImage || undefined
				);
			} else {
				await sendGroupMessage(
					selectedChat.id,
					data.content,
					selectedImage || undefined
				);
			}
			reset();
			setSelectedImage(null);
		} catch (error) {
			console.error("Failed to send message:", error);
		}
	};
	const currentChat =
		selectedChat?.type === "private"
			? friends.find((f) => f.userId === selectedChat.id)
			: groups.find((g) => g.groupId === selectedChat?.id);

	const displayName =
		selectedChat?.type === "private"
			? (currentChat as User)?.name
			: (currentChat as Group)?.groupName;

	const messages = selectedChat
		? selectedChat.type === "private"
			? privateMessages[selectedChat.id] || []
			: groupMessages[selectedChat.id] || []
		: [];

	if (!selectedChat) {
		return (
			<div className="flex flex-1 items-center justify-center bg-gray-50">
				<div className="text-center">
					<h3 className="text-xl font-semibold text-gray-700">
						Welcome to Chat
					</h3>
					<p className="text-gray-500 mt-2">
						Select a conversation to start messaging
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col bg-gray-50">
			{/* Chat Header */}
			<div className="flex items-center justify-between px-6 py-4 bg-white border-b">
				<div className="flex items-center space-x-4">
					<img
						src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
							displayName || ""
						)}`}
						alt="Chat avatar"
						className="w-10 h-10 rounded-full"
					/>
					<div>
						<h2 className="font-semibold text-gray-900">{displayName}</h2>
						<p className="text-sm text-gray-500">
							{selectedChat.type === "private"
								? "Online"
								: `${groupMembers.length} members`}
						</p>
					</div>
				</div>
				<div className="flex items-center space-x-4">
					{selectedChat.type === "group" && (
						<Button
							variant="secondary"
							size="sm"
							onClick={() => setShowInfo(true)}
						>
							<Info className="h-5 w-5" />
						</Button>
					)}
				</div>
			</div>

			{/* Messages Area */}
			<div className="flex-1 overflow-y-auto p-6 space-y-4">
				{messages.map((message) => (
					<div
						key={message.messageId}
						className={`flex ${
							message.senderId === Number(userId)
								? "justify-end"
								: "justify-start"
						}`}
					>
						<div
							className={`flex items-end space-x-2 max-w-[70%] ${
								message.senderId === Number(userId)
									? "flex-row-reverse space-x-reverse"
									: ""
							}`}
						>
							{message.senderId !== Number(userId) && (
								<img
									src={`https://ui-avatars.com/api/?name=${message.senderName}`}
									alt={message.senderName}
									className="w-8 h-8 rounded-full"
								/>
							)}
							<div
								className={`relative rounded-2xl px-4 py-2 ${
									message.senderId === Number(userId)
										? "bg-indigo-600 text-white"
										: "bg-white text-gray-900"
								}`}
							>
								{message.senderId !== Number(userId) && (
									<p className="text-xs font-medium mb-1">
										{message.senderName}
									</p>
								)}

								{editingMessageId === message.messageId ? (
									<div className="flex items-center gap-2">
										<input
											type="text"
											value={editContent}
											onChange={(e) => setEditContent(e.target.value)}
											className="rounded px-2 py-1 text-black text-sm w-full"
											autoFocus
										/>
										<button
											onClick={() =>
												handleEditMessage(message.messageId, editContent)
											}
											className="text-xs bg-green-500 hover:bg-green-600 text-white rounded px-2 py-1"
										>
											Save
										</button>
										<button
											onClick={() => setEditingMessageId(null)}
											className="text-xs bg-gray-500 hover:bg-gray-600 text-white rounded px-2 py-1"
										>
											<X size={12} />
										</button>
									</div>
								) : (
									<>
										<p className="text-sm">
											{decryptMessage(message.messageContent)}{" "}
											{/* Decrypt the message */}
										</p>
										{message.imagePath && (
											<img
												src={`http://localhost:5271/${message.imagePath}`}
												alt="Message attachment"
												className="mt-2 max-h-60 rounded-lg"
											/>
										)}
									</>
								)}

								<div className="flex items-center justify-between mt-1">
									<p className="text-xs opacity-75">
										{format(new Date(message.sentAt), "HH:mm")}
									</p>

									{message.senderId === Number(userId) && !editingMessageId && (
										<div className="flex gap-2 ml-2">
											<button
												onClick={() => {
													setEditingMessageId(message.messageId);
													setEditContent(message.messageContent);
												}}
												className="opacity-75 hover:opacity-100 transition-opacity"
											>
												<Edit2 size={14} />
											</button>
											<button
												onClick={() => handleDeleteMessage(message.messageId)}
												className="opacity-75 hover:opacity-100 transition-opacity"
											>
												<Trash2 size={14} />
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

			{/* Message Input */}
			<form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white border-t">
				<div className="flex items-center space-x-4">
					<label className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors">
						<Image className="h-5 w-10 text-gray-600" />
						<input
							type="file"
							className="hidden"
							accept="image/*"
							onChange={(e) => {
								if (e.target.files && e.target.files[0]) {
									setSelectedImage(e.target.files[0]);
								}
							}}
						/>
					</label>
					{selectedImage && (
						<div className="relative">
							<img
								src={URL.createObjectURL(selectedImage)}
								alt="Selected"
								className="w-20 h-20 object-cover rounded-lg"
							/>
							<button
								type="button"
								onClick={() => setSelectedImage(null)}
								className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					)}
					<Input
						{...register("content")}
						placeholder="Type your message..."
						className="flex-1 py-3"
					/>
					<Button
						type="submit"
						disabled={isSubmitting}
						className="w-10 h-10 rounded-full p-0 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700"
					>
						<Send className="h-5 w-10 text-white" />
					</Button>
				</div>
			</form>
			<GroupInfoModal
				isOpen={showInfo}
				onClose={() => setShowInfo(false)}
				group={
					selectedChat?.type === "group" ? (currentChat as Group) : undefined
				}
				members={groupMembers}
			/>
		</div>
	);
};
