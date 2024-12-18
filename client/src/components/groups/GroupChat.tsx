import React, { useState, useRef, useEffect } from "react";
import { Send, Image, Settings, UserPlus, Edit2, Trash2 } from "lucide-react";
import { Group, Message, User } from "../../types";

interface GroupChatProps {
	group: Group;
	messages: Message[];
	currentUser: User;
	onSendMessage: (content: string, groupId: number) => void;
	onEditMessage: (messageId: number, content: string) => void;
	onDeleteMessage: (messageId: number) => void;
	onAddMember: () => void;
	onOpenSettings: () => void;
}

export default function GroupChat({
	group,
	messages: messageList,
	currentUser,
	onSendMessage,
	onEditMessage,
	onDeleteMessage,
	onAddMember,
	onOpenSettings,
}: GroupChatProps) {
	const [newMessage, setNewMessage] = useState("");
	const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
	const [editContent, setEditContent] = useState("");
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setMessages(messageList);
	}, [messageList]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleSendMessage = () => {
		if (!newMessage.trim() && !selectedImage) return;

		const message: Message = {
			messageId: Date.now(),
			senderId: currentUser.userId,
			groupId: group.groupId,
			messageContent: newMessage.trim(),
			imageContent: selectedImage || undefined,
			sentAt: new Date().toISOString(),
		};

		setMessages((prevMessages) => [...prevMessages, message]);
		setNewMessage("");
		setSelectedImage(null);
		onSendMessage(message.messageContent, group.groupId);
	};

	const handleEditMessage = (messageId: number, content: string) => {
		if (!content.trim()) return;

		setMessages((prevMessages) =>
			prevMessages.map((msg) =>
				msg.messageId === messageId
					? { ...msg, messageContent: content.trim() }
					: msg
			)
		);

		setEditingMessageId(null);
		setEditContent("");
		onEditMessage(messageId, content.trim());
	};

	const handleDeleteMessage = (messageId: number) => {
		setMessages((prevMessages) =>
			prevMessages.filter((msg) => msg.messageId !== messageId)
		);
		onDeleteMessage(messageId);
	};

	const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedImage(file);
		}
	};

	const handleKeyPress = (
		e: React.KeyboardEvent,
		type: "new" | "edit",
		messageId?: number
	) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (type === "new") {
				handleSendMessage();
			} else if (type === "edit" && messageId) {
				handleEditMessage(messageId, editContent);
			}
		}
	};

	const renderMessageContent = (message: Message) => {
		return (
			<>
				{message.imageContent && (
					<div className="mb-2">
						<img
							src={URL.createObjectURL(message.imageContent)}
							alt="Message attachment"
							className="max-w-full rounded-lg"
						/>
						{message.messageContent && (
							<p className="mt-2 text-sm">{message.messageContent}</p>
						)}
					</div>
				)}
				{!message.imageContent && (
					<p className="whitespace-pre-wrap">{message.messageContent}</p>
				)}
			</>
		);
	};

	return (
		<div className="flex-1 flex flex-col h-full bg-gray-50">
			<div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<img
						src={
							group.avatar ||
							`https://ui-avatars.com/api/?name=${encodeURIComponent(
								group.groupName
							)}`
						}
						alt={group.groupName}
						className="w-10 h-10 rounded-full object-cover"
					/>
					<div>
						<h2 className="font-medium text-gray-900">{group.groupName}</h2>
						<p className="text-sm text-gray-500">
							{group.members.length} members
						</p>
					</div>
				</div>
				<div className="flex space-x-2">
					<button
						onClick={onAddMember}
						className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
					>
						<UserPlus size={20} />
					</button>
					<button
						onClick={onOpenSettings}
						className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
					>
						<Settings size={20} />
					</button>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.map((message) => (
					<div
						key={message.messageId}
						className={`flex ${
							message.senderId === currentUser.userId
								? "justify-end"
								: "justify-start"
						}`}
					>
						<div
							className={`max-w-[70%] rounded-2xl p-4 ${
								message.senderId === currentUser.userId
									? "bg-indigo-600 text-white"
									: "bg-white shadow-md"
							}`}
						>
							{editingMessageId === message.messageId ? (
								<textarea
									value={editContent}
									onChange={(e) => setEditContent(e.target.value)}
									onKeyPress={(e) =>
										handleKeyPress(e, "edit", message.messageId)
									}
									className="w-full bg-white text-gray-900 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
									autoFocus
								/>
							) : (
								<>
									{renderMessageContent(message)}
									<div className="flex items-center justify-end space-x-2 mt-2">
										<span className="text-xs opacity-75">
											{new Date(message.sentAt).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
										{message.senderId === currentUser.userId && (
											<div className="flex space-x-2">
												<button
													onClick={() => {
														setEditingMessageId(message.messageId);
														setEditContent(message.messageContent || "");
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
								</>
							)}
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

			<div className="bg-white border-t border-gray-200 p-4">
				<div className="flex items-center space-x-4">
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleImageSelect}
						accept="image/*"
						className="hidden"
					/>
					<button
						onClick={() => fileInputRef.current?.click()}
						className="text-gray-500 hover:text-indigo-600 transition-colors"
					>
						<Image size={24} />
					</button>
					<textarea
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						onKeyPress={(e) => handleKeyPress(e, "new")}
						placeholder="Type a message..."
						className="flex-1 px-4 py-2 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
						rows={1}
					/>
					<button
						onClick={handleSendMessage}
						className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors"
					>
						<Send size={20} />
					</button>
				</div>
				{selectedImage && (
					<div className="mt-2 p-2 bg-gray-100 rounded-lg">
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600">
								Selected: {selectedImage.name}
							</span>
							<button
								onClick={() => setSelectedImage(null)}
								className="text-red-500 hover:text-red-700"
							>
								Remove
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
