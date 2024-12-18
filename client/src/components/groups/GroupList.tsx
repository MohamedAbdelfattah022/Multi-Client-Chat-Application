import React, { useState } from "react";
import { Users, Plus, Search } from "lucide-react";
import { Group, User } from "../../types/index";
import CreateGroupModal from "./modals/CreateGroupModal";
import SearchInput from "../common/SearchInput";

interface GroupListProps {
	groups: Group[];
	contacts: User[];
	onGroupSelect: (groupId: number) => void;
	onCreateGroup: (name: string, description: string, members: number[]) => void;
}

export default function GroupList({
	groups,
	contacts,
	onGroupSelect,
	onCreateGroup,
}: GroupListProps) {
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredGroups = groups.filter((group) =>
		group.groupName.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white ">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-screen flex flex-col">
				{/* Fixed Header Section */}
				<div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
							<Users className="h-8 w-8 text-indigo-600" />
							Your Groups
						</h1>
						<p className="mt-2 text-gray-600">
							Manage and join group conversations
						</p>
					</div>
					<button
						onClick={() => setShowCreateModal(true)}
						className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl
                     hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
					>
						<Plus className="h-5 w-5" />
						<span>Create Group</span>
					</button>
				</div>

				{/* Fixed Search Bar */}
				<div className="mb-8">
					<div className="relative max-w-md mx-auto">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						<SearchInput
							value={searchQuery}
							onChange={setSearchQuery}
							placeholder="Search groups..."
						/>
					</div>
				</div>

				{/* Scrollable Groups Grid */}
				<div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-2">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
						{filteredGroups.map((group) => (
							<button
								key={group.groupId}
								onClick={() => onGroupSelect(group.groupId)}
								className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200
                         transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							>
								<div className="flex flex-col items-center text-center">
									<div className="relative mb-4">
										<img
											src={
												group.avatar ||
												`https://ui-avatars.com/api/?name=${encodeURIComponent(
													group.groupName
												)}`
											}
											alt={group.groupName}
											className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
										/>
										<span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
									</div>
									<h3 className="font-semibold text-gray-900 mb-2">
										{group.groupName}
									</h3>
									<p className="text-sm text-gray-500">
										{group.members.length}{" "}
										{group.members.length === 1 ? "member" : "members"}
									</p>
								</div>
							</button>
						))}

						{filteredGroups.length === 0 && (
							<div className="col-span-full text-center py-12">
								<Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									No Groups Found
								</h3>
								<p className="text-gray-600">
									Create a new group or try a different search term
								</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{showCreateModal && (
				<CreateGroupModal
					contacts={contacts}
					onCreateGroup={(...args) => {
						onCreateGroup(...args);
						setShowCreateModal(false);
					}}
					onClose={() => setShowCreateModal(false)}
				/>
			)}
		</div>
	);
}
