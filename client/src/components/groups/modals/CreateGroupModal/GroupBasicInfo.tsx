import React, { useRef } from "react";
import { ImageIcon } from "lucide-react";

interface GroupBasicInfoProps {
	groupName: string;
	description: string;
	groupImage: string;
	onGroupNameChange: (name: string) => void;
	onDescriptionChange: (desc: string) => void;
	onImageChange: (image: string) => void; // Updated to accept base64 or image URL
}

export default function GroupBasicInfo({
	groupName,
	description,
	groupImage,
	onGroupNameChange,
	onDescriptionChange,
	onImageChange,
}: GroupBasicInfoProps) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				if (reader.result) {
					onImageChange(reader.result as string); // Send base64 string to the parent
				}
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center space-x-4">
				<div className="relative">
					<div className="w-20 h-20 rounded-lg overflow-hidden">
						<img
							src={
								groupImage ||
								`https://ui-avatars.com/api/?name=${encodeURIComponent(
									groupName || "Group"
								)}`
							}
							alt="Group avatar"
							className="w-full h-full object-cover"
						/>
					</div>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-50"
					>
						<ImageIcon size={16} className="text-gray-600" />
					</button>
					<input
						type="file"
						ref={fileInputRef}
						accept="image/*"
						className="hidden"
						onChange={handleImageUpload}
					/>
				</div>
				<div className="flex-1">
					<input
						type="text"
						value={groupName}
						onChange={(e) => onGroupNameChange(e.target.value)}
						placeholder="Group name"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
						required
					/>
				</div>
			</div>

			<textarea
				value={description}
				onChange={(e) => onDescriptionChange(e.target.value)}
				placeholder="Group description (optional)"
				className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
			/>
		</div>
	);
}
