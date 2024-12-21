import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { useState, useEffect } from "react";

export const useSignalR = (url: string) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(url, { withCredentials: true })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, [url]);

    return connection;
};
