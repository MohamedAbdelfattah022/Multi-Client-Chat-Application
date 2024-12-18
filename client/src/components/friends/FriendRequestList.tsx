import { Check, X, UserPlus, Users, Bell } from "lucide-react";
import { User, FriendRequest } from "../../types";
import AddFriendForm from "./AddFriendForm";

interface FriendRequestListProps {
	requests: Array<{ request: FriendRequest; user: User }>;
	onAccept: (requestId: number) => void;
	onReject: (requestId: number) => void;
	onSendRequest: (email: string) => void;
}

export default function FriendRequestList({
	requests,
	onAccept,
	onReject,
	onSendRequest,
}: FriendRequestListProps) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header Section */}
				<div className="text-center mb-12">
					<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
						<Users className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600" />
						Friend Center
					</h1>
					<p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
						Connect with friends and manage your network
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{/* Add Friend Section */}
					<div className="md:col-span-2 lg:col-span-1">
						<div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
							<AddFriendForm onSendRequest={onSendRequest} />
						</div>
					</div>

					{/* Friend Requests Section */}
					<div className="md:col-span-2 lg:col-span-2">
						<div className="bg-white rounded-2xl shadow-xl p-5 h-[calc(100vh-20rem)] sm:h-[calc(100vh-15rem)]">
							<div className="flex items-center justify-between mb-8">
								<div className="flex items-center gap-3">
									<div className="bg-indigo-100 p-3 rounded-xl">
										<Bell className="h-6 w-6 text-indigo-600" />
									</div>
									<div>
										<h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
											Pending Requests
										</h2>
										<p className="text-gray-500">
											You have {requests.length} pending requests
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-4 overflow-y-auto h-[calc(100%-5rem)] pr-2 custom-scrollbar">
								{requests.map(({ request, user }) => (
									<div
										key={request.requestId}
										className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gray-50 rounded-xl
                             hover:bg-indigo-50 transition-all duration-300 group"
									>
										<div className="flex items-center gap-4">
											<div className="relative">
												<img
													src={
														user.profilePic ||
														`https://ui-avatars.com/api/?name=${encodeURIComponent(
															user.name
														)}`
													}
													alt={user.name}
													className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white shadow-md
                                   group-hover:border-indigo-200 transition-all duration-300"
												/>
												<span className="absolute bottom-1 right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white"></span>
											</div>
											<div>
												<h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
													{user.name}
												</h3>
												<p className="text-xs sm:text-sm text-gray-600">
													{user.email}
												</p>
											</div>
										</div>
										<div className="flex gap-3">
											<button
												onClick={() => onAccept(request.requestId)}
												className="px-4 sm:px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600
                                 transition-all duration-200 flex items-center gap-2"
											>
												<Check className="h-4 w-4 sm:h-5 sm:w-5" />
												Accept
											</button>
											<button
												onClick={() => onReject(request.requestId)}
												className="px-4 sm:px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600
                                 transition-all duration-200 flex items-center gap-2"
											>
												<X className="h-4 w-4 sm:h-5 sm:w-5" />
												Decline
											</button>
										</div>
									</div>
								))}

								{requests.length === 0 && (
									<div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl">
										<UserPlus className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
										<h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2">
											No Pending Requests
										</h3>
										<p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
											When someone sends you a friend request, it will appear
											here. Start by adding some friends!
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
