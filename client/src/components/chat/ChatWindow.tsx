import React, { useEffect, useRef } from "react";
import { Send, Image } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useChatStore } from "../../stores/chatStore";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface MessageFormData {
	content: string;
	image?: FileList;
}

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
	} = useChatStore();

	const { userId } = useAuthStore();
	useEffect(() => {
		if (userId) {
			initializeSignalR(userId);

			return () => {
				disconnectSignalR(userId);
			};
		}
	}, [userId, initializeSignalR, disconnectSignalR]);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = useForm<MessageFormData>();

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
		if (!selectedChat || (!data.content.trim() && !data.image?.[0])) return;

		try {
			if (selectedChat.type === "private") {
				await sendPrivateMessage(
					selectedChat.id,
					data.content,
					data.image?.[0]
				);
			} else {
				await sendGroupMessage(selectedChat.id, data.content, data.image?.[0]);
			}
			reset();
		} catch (error) {
			console.error("Failed to send message:", error);
		}
	};

	const messages = selectedChat
		? selectedChat.type === "private"
			? privateMessages[selectedChat.id] || []
			: groupMessages[selectedChat.id] || []
		: [];

	if (!selectedChat) {
		return (
			<div className="flex flex-1 items-center justify-center bg-gray-50">
				<p className="text-gray-500">Select a chat to start messaging</p>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col bg-gray-50">
			<div className="flex-1 overflow-y-auto p-4">
				<div className="space-y-4">
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
								className={`max-w-[70%] rounded-lg px-4 py-2 ${
									message.senderId === Number(userId)
										? "bg-blue-500 text-white"
										: "bg-white text-gray-900"
								}`}
							>
								{message.senderId !== Number(userId) && (
									<p className="mb-1 text-xs font-medium">
										{message.senderName}
									</p>
								)}
								<p>{message.messageContent}</p>
								{message.imageContent && (
									<img
										src={message.imageContent}
										alt="Message attachment"
										className="mt-2 max-h-60 rounded-lg"
									/>
								)}
								<p className="mt-1 text-xs opacity-75">
									{format(new Date(message.sentAt), "HH:mm")}
								</p>
							</div>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="border-t bg-white p-4">
				<div className="flex space-x-2">
					<label className="flex cursor-pointer items-center justify-center rounded-lg bg-gray-100 px-4 hover:bg-gray-200">
						<Image className="h-5 w-5 text-gray-500" />
						<input
							type="file"
							className="hidden"
							accept="image/*"
							{...register("image")}
						/>
					</label>
					<Input
						{...register("content")}
						placeholder="Type a message..."
						className="flex-1"
					/>
					<Button type="submit" disabled={isSubmitting}>
						<Send className="h-5 w-5" />
					</Button>
				</div>
			</form>
		</div>
	);
};
