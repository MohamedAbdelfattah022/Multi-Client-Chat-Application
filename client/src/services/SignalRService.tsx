import * as signalR from "@microsoft/signalr";

class SignalRService {
	private connection: signalR.HubConnection;
	private messageCallbacks: ((message: any) => void)[] = [];
	private groupMessageCallbacks: ((message: any) => void)[] = [];

	constructor() {
		this.connection = new signalR.HubConnectionBuilder()
			.withUrl("http://localhost:5271/chatHub")
			.withAutomaticReconnect()
			.configureLogging(signalR.LogLevel.Information)
			.build();

		this.connection.on("ReceiveMessage", (message) => {
			this.messageCallbacks.forEach((callback) => callback(message));
		});

		this.connection.on("ReceiveGroupMessage", (message) => {
			this.groupMessageCallbacks.forEach((callback) => callback(message));
		});
	}

	public async start(userId: string) {
		try {
			if (this.connection.state === signalR.HubConnectionState.Disconnected) {
				await this.connection.start();
				console.log("SignalR Connected");
				await this.connection.invoke("JoinPrivateChat", userId.toString());
				console.log(`Joined private chat for user: ${userId}`);
			}
		} catch (err) {
			console.error("SignalR Connection Error: ", err);
			setTimeout(() => this.start(userId), 5000);
		}
	}

	public async stop(userId: string) {
		if (this.connection.state === "Connected") {
			await this.connection.invoke("LeavePrivateChat", userId);
			await this.connection.stop();
			console.log("SignalR Disconnected");
		}
	}

	public onMessage(callback: (message: any) => void) {
		this.messageCallbacks.push(callback);
		return () => {
			this.messageCallbacks = this.messageCallbacks.filter(
				(cb) => cb !== callback
			);
		};
	}

	public onGroupMessage(callback: (message: any) => void) {
		this.groupMessageCallbacks.push(callback);
		return () => {
			this.groupMessageCallbacks = this.groupMessageCallbacks.filter(
				(cb) => cb !== callback
			);
		};
	}

	public async joinGroupChat(groupId: string) {
		if (this.connection.state === signalR.HubConnectionState.Connected) {
			await this.connection.invoke("JoinGroupChat", groupId);
			console.log(`Joined group chat: ${groupId}`);
		}
	}

	public async leaveGroupChat(groupId: string) {
		if (this.connection.state === signalR.HubConnectionState.Connected) {
			await this.connection.invoke("LeaveGroupChat", groupId);
			console.log(`Left group chat: ${groupId}`);
		}
	}

	public async initializePrivateChat(
		currentUserId: string,
		targetUserId: string
	) {
		if (this.connection.state === signalR.HubConnectionState.Connected) {
			await this.connection.invoke(
				"InitiatePrivateChat",
				currentUserId,
				targetUserId
			);
			console.log(
				`Initialized private chat between ${currentUserId} and ${targetUserId}`
			);
		}
	}
}

export const signalRService = new SignalRService();
