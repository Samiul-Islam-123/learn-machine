import React, { useEffect, useRef } from 'react';
import { useSocket } from '../../../Contexts/SocketProvider';
import { useMessages } from '../../../Contexts/MessageProvider';
import Chat from './Chat';
import { useLoading } from '../../../Contexts/LoadingContext'; // Import the loading context

function ChatBody() {
    const { messages, addMessage, updateMessage } = useMessages();
    const socket = useSocket();
    const { loading, startLoading, finishLoading } = useLoading(); // Use the loading context
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (socket) {
            socket.on('prompt-response-doubt', (data) => {
                console.log(data)
                if (loading) {
                    updateMessage('bot', data.text);
                } else {
                    addMessage('bot', data.text);
                    startLoading(); // Start loading when a new response begins
                }
                scrollToBottom();
            });

            socket.on('response-doubt-end', () => {
                finishLoading(); // Finish loading when the response ends
            });

            return () => {
                socket.off('prompt-response-doubt');
                socket.off('response-doubt-end');
            };
        }
    }, [socket, addMessage, updateMessage, loading, startLoading, finishLoading]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div style={{ height: '80vh', overflow: 'auto', position: 'relative' }}>
            <style>
                {`
                    .scrollbar-container::-webkit-scrollbar {
                        width: 10px; /* Width of the scrollbar */
                    }
                    .scrollbar-container::-webkit-scrollbar-track {
                        background: #f1f1f1; /* Color of the scrollbar track */
                    }
                    .scrollbar-container::-webkit-scrollbar-thumb {
                        background: #888; /* Color of the scrollbar handle */
                    }
                    .scrollbar-container::-webkit-scrollbar-thumb:hover {
                        background: #555; /* Color of the scrollbar handle on hover */
                    }
                `}
            </style>
            <div className="scrollbar-container" style={{ paddingBottom: '50px' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <Chat 
                            content={msg.message}
                            source={msg.sender === 'user' ? 'outgoing' : 'incoming'}
                        />
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}

export default ChatBody;
