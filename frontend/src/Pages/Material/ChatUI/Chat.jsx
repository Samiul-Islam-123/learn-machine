import React from 'react';
import { Card, CardContent } from "@mui/material";
import ReactMarkdown from 'react-markdown';

function Chat({ content, source }) {
    const marginLeft = source === 'outgoing' ? 'auto' : '0';
    const chatColor = source === 'outgoing' ? "#CCCCCC" : "#7FB3D5";

    return (
        <Card style={{
            marginLeft: marginLeft,
            backgroundColor: chatColor,
            width: "fit-content",
            marginTop: "10px",
            marginBottom: "10px",
            color: 'black',
            minWidth : "50px"
        }}>
            <CardContent style={{ padding: '5px' }}>
                <ReactMarkdown>
                    {content}
                </ReactMarkdown>
            </CardContent>
        </Card>
    );
}

export default Chat;
