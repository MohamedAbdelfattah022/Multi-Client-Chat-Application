import React from "react";
import { UserPlus, Check, X } from "lucide-react";
import { Button } from "../ui/Button";
import { useFriendStore } from "../../stores/friendStore";

export const FriendRequests: React.FC = () => {
	const { pendingRequests, acceptRequest, rejectRequest } = useFriendStore();

	if (pendingRequests.length === 0) {
		return (
			<div className="p-4 text-center text-gray-500">
				No pending friend requests
			</div>
		);
	}

	return (
		<div className="space-y-2 p-4">
			{pendingRequests.map((request) => (
				<div
					key={request.requestId}
					className="flex items-center justify-between rounded-lg border bg-white p-3"
				>
					<div className="flex items-center space-x-3">
						<div className="h-10 w-10 rounded-full bg-gray-200">
							<div className="flex h-full w-full items-center justify-center">
								<UserPlus className="h-5 w-5 text-gray-500" />
							</div>
						</div>
						<div>
							<p className="font-medium">{request.senderName}</p>
							{/* <p className="text-sm text-gray-500">{request.senderEmail}</p> */}
						</div>
					</div>
					<div className="flex space-x-2">
						<Button
							size="sm"
							onClick={() => acceptRequest(request.requestId)}
							className="bg-green-500 hover:bg-green-600"
						>
							<Check className="h-4 w-4" />
						</Button>
						<Button
							size="sm"
							variant="danger"
							onClick={() => rejectRequest(request.requestId)}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>
			))}
		</div>
	);
};
