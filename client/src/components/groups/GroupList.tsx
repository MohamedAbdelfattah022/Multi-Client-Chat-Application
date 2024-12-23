import { useState } from "react";
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
		<div className="h-full bg-white">
			<div className="flex flex-col h-full">
				{/* Search Bar */}
				<div className="p-4 border-b">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						<SearchInput
							value={searchQuery}
							onChange={setSearchQuery}
							placeholder="Search groups"
						/>
					</div>
				</div>

				{/* Groups List */}
				<div className="flex-1 overflow-y-auto">
					{filteredGroups.map((group) => (
						<button
							key={group.groupId}
							onClick={() => onGroupSelect(group.groupId)}
							className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors border-b"
						>
							<div className="relative">
								<img
									src={
										group.avatar ||
										`https://ui-avatars.com/api/?name=${encodeURIComponent(
											group.groupName
										)}`
									}
									alt={group.groupName}
									className="w-12 h-12 rounded-full object-cover"
								/>
							</div>
							<div className="ml-4 flex-1 min-w-0">
								<div className="flex items-center justify-between">
									<h3 className="font-medium text-gray-900 truncate">
										{group.groupName}
									</h3>
								</div>
							</div>
						</button>
					))}

					{filteredGroups.length === 0 && (
						<div className="flex flex-col items-center justify-center h-full text-center p-4">
							<Users className="h-12 w-12 text-gray-400 mb-2" />
							<p className="text-gray-600">No groups found</p>
						</div>
					)}
				</div>

				{/* Create Group Button */}
				<div className="p-4 border-t">
					<button
						onClick={() => setShowCreateModal(true)}
						className="w-full flex items-center justify-center gap-2 p-3 bg-indigo-600 text-white rounded-lg
						hover:bg-indigo-700 transition-colors"
					>
						<Plus className="h-5 w-5" />
						Create New Group
					</button>
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
