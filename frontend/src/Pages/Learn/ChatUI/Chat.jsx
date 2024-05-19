import React from 'react'
import {Card, CardContent, Typography} from "@mui/material"


function Chat({content, source}) {

    const marginLeft = source === 'outgoing' ? 'auto' : '0';
    const chatColor = source === 'outgoing' ? "#CCCCCC" : "#7FB3D5"

  return (
    <>
        <Card style={{
            marginLeft : marginLeft,
            backgroundColor : chatColor,
            width : "fit-content",
            marginTop : "10px",
            marginBottom : "10px",
            color : 'black'
        }}>
            <CardContent>
                <Typography variant='h7'>
                    {content}
                </Typography>
            </CardContent>
        </Card>
    </>
  )
}

export default Chat