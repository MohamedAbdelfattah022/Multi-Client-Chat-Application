import { useState, useEffect } from "react";
import { MessageSquare, Plus, Search } from "lucide-react";
import NewChatButton from "./NewChatButton";
import NewChatModal from "./NewChatModal";
import SearchInput from "../common/SearchInput";
import { User } from "../../types";
import { getPrivateMessages } from "../../services/api";

interface ChatListProps {
	chats: User[];
	contacts: User[];
	onChatSelect: (user: User) => void;
}

const ChatList = ({ chats, contacts, onChatSelect }: ChatListProps) => {
	const [showNewChatModal, setShowNewChatModal] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [lastMessages, setLastMessages] = useState<Record<number, string>>({});

	useEffect(() => {
		const loadLastMessages = async () => {
			const currentUserId = parseInt(localStorage.getItem("userId") || "0");
			if (!currentUserId) return;

			const messages: Record<number, string> = {};
			for (const chat of chats) {
				try {
					const chatMessages = await getPrivateMessages({
						senderId: currentUserId,
						recipientId: chat.userId,
					});
					if (chatMessages.length > 0) {
						messages[chat.userId] = chatMessages[0].messageContent;
					}
				} catch (error) {
					console.error("Error loading messages:", error);
				}
			}
			setLastMessages(messages);
		};

		loadLastMessages();
	}, [chats]);

	const filteredChats = chats.filter(
		(chat) =>
			chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			chat.email.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-screen flex flex-col">
				{/* Fixed Header Section */}
				<div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
							<MessageSquare className="h-8 w-8 text-indigo-600" />
							Your Messages
						</h1>
						<p className="mt-2 text-gray-600">
							Stay connected with your friends
						</p>
					</div>
					<NewChatButton onClick={() => setShowNewChatModal(true)} />
				</div>

				{/* Fixed Search Bar */}
				<div className="mb-8">
					<div className="relative max-w-md mx-auto">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						<SearchInput
							value={searchQuery}
							onChange={setSearchQuery}
							placeholder="Search messages..."
						/>
					</div>
				</div>

				{/* Scrollable Chats Grid */}
				<div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-2">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
						{filteredChats.map((chat) => (
							<button
								key={chat.userId}
								onClick={() => onChatSelect(chat)}
								className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200
												 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							>
								<div className="flex flex-col items-center text-center">
									<div className="relative mb-4">
										<img
											src={
												chat.profilePic ||
												`https://ui-avatars.com/api/?name=${encodeURIComponent(
													chat.name
												)}`
											}
											alt={chat.name}
											className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
										/>
										<span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
									</div>
									<h3 className="font-semibold text-gray-900 mb-2">
										{chat.name}
									</h3>
									<p className="text-sm text-gray-500 line-clamp-2">
										{lastMessages[chat.userId] || "No messages yet"}
									</p>
								</div>
							</button>
						))}

						{filteredChats.length === 0 && (
							<div className="col-span-full text-center py-12">
								<MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									No Messages Found
								</h3>
								<p className="text-gray-600">
									Start a new conversation or try a different search term
								</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{showNewChatModal && (
				<NewChatModal
					contacts={contacts}
					onStartChat={(userId: number) => {
						const user = contacts.find((contact) => contact.userId === userId);
						if (user) {
							onChatSelect(user);
							setShowNewChatModal(false);
						}
					}}
					onClose={() => setShowNewChatModal(false)}
				/>
			)}
		</div>
	);
};
export default ChatList;
