"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function WebSocketClient() {
    const socketRef = useRef<Socket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");

    //Socket connection for client side application
    useEffect(() => {
        // 1. Establish connection to your external or custom WebSocket server
        const socket = io("http://localhost:4000");
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Socket connected");
        });

        // 2. Handle incoming messages from the server (.on())
        socket.on("alert", (msg) => {
            console.log(msg);
            setMessages((prev) => [...prev, msg]);
        });

        // 3. Clean up the connection when the component unmounts
        return () => {
            socket.off("connect");
            socket.off("alert");
            socket.disconnect();
        };
    }, [])

    // 4. Send the message to the server (.emit())
    const sendMessage = () => {
        if (socketRef.current && inputValue.trim()) {
            socketRef.current.emit("alert", inputValue);
            setInputValue("");
        }
    };
    console.log(messages)

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">WebSocket Chat</h1>
            <div className="border h-60 overflow-y-auto p-2 mb-4 bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={index} className="p-1 border-b text-sm">
                        {msg}
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="border p-2 flex-grow rounded"
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">
                    Send
                </button>
            </div>
        </div>
    );
}
