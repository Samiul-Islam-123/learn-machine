import { Icon, IconButton, TextField } from '@mui/material';
import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useSocket } from '../../../Contexts/SocketProvider';
import { useMessages } from '../../../Contexts/MessageProvider';

function ChatFooter() {
    const socket = useSocket();
    const [userPrompt, setUserPrompt] = useState("");
    const {addMessage} = useMessages();

    const handleSendMessage = () => {
        if (userPrompt.trim() !== "") {
            socket.emit('process-prompt', {
                feature: "learn",
                prompt: userPrompt,
                prompt_type : "text"
            });
            addMessage('user', userPrompt)
            setUserPrompt(""); // Clear the input field after sending
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div style={{ display: "flex", marginTop: "5px" }}>
            <IconButton>
                <Icon>
                    <UploadFileIcon />
                </Icon>
            </IconButton>
            <TextField
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                label="What do you want to learn"
                fullWidth
            />
            <IconButton onClick={handleSendMessage}>
                <Icon>
                    <SendIcon />
                </Icon>
            </IconButton>
        </div>
    );
}

export default ChatFooter;
