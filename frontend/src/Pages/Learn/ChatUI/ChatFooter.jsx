import { Icon, IconButton, TextField } from '@mui/material'
import React from 'react'
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';

function ChatFooter() {
    return (
        <>
            <div style={{
                display: "flex",
                marginTop : "5px"
            }}>
                <IconButton>
                    <Icon>
                        <UploadFileIcon />
                    </Icon>
                </IconButton>
                <TextField variant='outlined' label="what do you want to learn" fullWidth />
                <IconButton>
                    <Icon>
                        <SendIcon />
                    </Icon>
                </IconButton>
            </div>
        </>
    )
}

export default ChatFooter