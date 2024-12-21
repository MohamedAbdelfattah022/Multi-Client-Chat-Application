import signalR from "@microsoft/signalr";
import { MessageSquare, Users, UserPlus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
	activeTab: "chats" | "groups" | "requests" | "settings";
	onTabChange: (tab: "chats" | "groups" | "requests" | "settings") => void;
	onLogout: () => void;
}

export default function Navigation({
	activeTab,
	onTabChange,
	onLogout,
}: NavigationProps) {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");

		const connection = new signalR.HubConnectionBuilder()
			.withUrl("http://localhost:5271/chatHub")
			.build();
		if (connection) {
			connection.stop();
		}
		onLogout();
		navigate("/login");
	};

	return (
		<nav className="fixed bottom-0 left-0 w-full md:relative md:w-20 bg-indigo-600 flex md:flex-col justify-between items-center p-2 md:p-4 md:h-screen">
			{/* Main Navigation Items */}
			<div className="flex md:flex-col items-center justify-center flex-1 w-full md:space-y-6 space-x-4 md:space-x-0">
				<button
					onClick={() => onTabChange("chats")}
					className={`p-2 md:p-3 text-white rounded-xl transition-colors duration-200 ease-in-out ${
						activeTab === "chats"
							? "bg-indigo-700 shadow-lg"
							: "hover:bg-indigo-700/50"
					}`}
					aria-label="Chats"
				>
					<MessageSquare className="w-6 h-6" />
				</button>

				<button
					onClick={() => onTabChange("groups")}
					className={`p-2 md:p-3 text-white rounded-xl transition-colors duration-200 ease-in-out ${
						activeTab === "groups"
							? "bg-indigo-700 shadow-lg"
							: "hover:bg-indigo-700/50"
					}`}
					aria-label="Groups"
				>
					<Users className="w-6 h-6" />
				</button>

				<button
					onClick={() => onTabChange("requests")}
					className={`p-2 md:p-3 text-white rounded-xl transition-colors duration-200 ease-in-out ${
						activeTab === "requests"
							? "bg-indigo-700 shadow-lg"
							: "hover:bg-indigo-700/50"
					}`}
					aria-label="Requests"
				>
					<UserPlus className="w-6 h-6" />
				</button>
			</div>

			{/* Logout Button */}
			<button
				onClick={handleLogout}
				className="p-2 md:p-3 text-white hover:bg-indigo-700/50 rounded-xl transition-colors duration-200 ease-in-out"
				aria-label="Logout"
			>
				<LogOut className="w-6 h-6" />
			</button>
		</nav>
	);
}
