import React, { createContext, useContext, useState } from 'react';

const MessageContext = createContext();

export function useMessages() {
    return useContext(MessageContext);
}

export function MessageProvider({ children }) {
    const [messages, setMessages] = useState([]);

    const addMessage = (sender, message) => {
        setMessages(prevMessages => [...prevMessages, { sender, message }]);
    };

    const updateMessage = (sender, newChunk) => {
        setMessages(prevMessages => {
            const messagesCopy = [...prevMessages];
            const lastMessageIndex = messagesCopy.length - 1;
            if (messagesCopy[lastMessageIndex]?.sender === sender) {
                messagesCopy[lastMessageIndex].message += newChunk;
            }
            return messagesCopy;
        });
    };

    return (
        <MessageContext.Provider value={{ messages, addMessage, updateMessage }}>
            {children}
        </MessageContext.Provider>
    );
}
