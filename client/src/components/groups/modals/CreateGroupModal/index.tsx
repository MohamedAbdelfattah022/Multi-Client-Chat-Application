import React, { useState } from "react";
import { User } from "../../../../types";
import GroupBasicInfo from "./GroupBasicInfo";
import MemberSelection from "./MemberSelection";
import ModalFooter from "./ModalFooter";
import ModalHeader from "../../../common/ModalHeader";

interface CreateGroupModalProps {
	contacts: User[];
	onCreateGroup: (
		groupName: string,
		description: string,
		members: number[]
	) => void;
	onClose: () => void;
}

export default function CreateGroupModal({
	contacts,
	onCreateGroup,
	onClose,
}: CreateGroupModalProps) {
	const [groupName, setGroupName] = useState("");
	const [description, setDescription] = useState("");
	const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
	const [groupImage, setGroupImage] = useState<string>("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (groupName.trim() && selectedMembers.length > 0) {
			onCreateGroup(groupName.trim(), description.trim(), selectedMembers);
			onClose();
		}
	};

	const isValid = groupName.trim().length > 0 && selectedMembers.length > 0;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
				<ModalHeader title="Create New Group" onClose={onClose} icon="users" />

				<form onSubmit={handleSubmit} className="p-4 space-y-6">
					<GroupBasicInfo
						groupName={groupName}
						description={description}
						groupImage={groupImage}
						onGroupNameChange={setGroupName}
						onDescriptionChange={setDescription}
						onImageChange={setGroupImage}
					/>

					<MemberSelection
						contacts={contacts}
						selectedMembers={selectedMembers}
						onMemberToggle={(userId) => {
							setSelectedMembers((prev) =>
								prev.includes(userId)
									? prev.filter((id) => id !== userId)
									: [...prev, userId]
							);
						}}
					/>

					<ModalFooter
						isValid={isValid}
						onCancel={onClose}
						submitText="Create Group"
					/>
				</form>
			</div>
		</div>
	);
}
