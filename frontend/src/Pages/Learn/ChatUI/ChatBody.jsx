import React from 'react';
import Chat from './Chat';

function ChatBody() {
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
        {/* Your chat content goes here */}
        <Chat content="Hello world" source="incoming" />
        <Chat content="Hello world" source="outgoing" />
        <Chat content="Hello world" source="incoming" />
        <Chat content="Hello world" source="outgoing" />
        <Chat content="Hello world" source="incoming" />
        <Chat content="Hello world" source="outgoing" />
        <Chat content="Hello world" source="incoming" />
        <Chat content="Hello world" source="outgoing" />
        <Chat content="Hello world" source="incoming" />
        <Chat content="Hello world" source="outgoing" />
        <Chat content="Hello world" source="incoming" />
        <Chat content="Hello world" source="outgoing" />
        <Chat content="Hello world" source="incoming" />
        <Chat content="Hello world" source="outgoing" />
        <Chat content="Hello world" source="incoming" />
        <Chat content="Hello world" source="outgoing" />
        <Chat content="Hello world" source="incoming" />
        <Chat content="Hello world" source="incoming" />
        <Chat content="Hello world" source="outgoing" />
      </div>
    </div>
  );
}

export default ChatBody;
