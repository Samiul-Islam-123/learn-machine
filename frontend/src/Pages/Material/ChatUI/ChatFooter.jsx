import { Icon, IconButton, TextField } from '@mui/material';
import React, { useState, useRef } from 'react';
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useSocket } from '../../../Contexts/SocketProvider';
import { useMessages } from '../../../Contexts/MessageProvider';

function ChatFooter() {
    const socket = useSocket();
    const [userPrompt, setUserPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);
    const { addMessage } = useMessages();

    const handleSendMessage = async () => {
        if (userPrompt.trim() !== "") {
            const filesDataPromises = selectedFiles.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve({
                            name: file.name,
                            type: file.type,
                            data: reader.result.split(',')[1], // Base64 without prefix
                        });
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            try {
                const filesData = await Promise.all(filesDataPromises);

                socket.emit('process-prompt', {
                    feature: "doubt",
                    prompt_type: "file",
                    prompt: userPrompt,
                    files: filesData,
                });

                addMessage('user', userPrompt);
                setUserPrompt(""); // Clear the input field after sending
                setSelectedFiles([]); // Clear selected files
            } catch (error) {
                console.error('Error reading files:', error);
            }
        }
    };

    const handleFileInputChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div style={{ display: "flex", marginTop: "5px" }}>
            <IconButton onClick={() => fileInputRef.current.click()}>
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
            {/* Hidden file input element */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                multiple
                onChange={handleFileInputChange}
            />
        </div>
    );
}

export default ChatFooter;
