import { Card, CardContent, Grid, IconButton, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge
} from 'reactflow';
import 'reactflow/dist/style.css';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useSocket } from '../../Contexts/SocketProvider';
import {Remarkable} from 'remarkable'; // Import the remarkable library
import ReactMarkdown from "react-markdown";
import { useLoading } from '../../Contexts/LoadingContext';


const parseRoadmap = (text) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const nodes = [];
  const edges = [];
  let currentPhase = null;
  let currentMainTask = null;
  let yOffset = 0;
  const phaseXOffset = 0;
  const mainTaskXOffset = 200;
  const subTaskXOffset = 400;

  lines.forEach(line => {
    if (line.startsWith('Phase')) {
      yOffset += 150;
      const phaseLabel = line.replace('Phase', '').trim(); // Remove 'Phase' and trim the label
      currentPhase = { id: `phase-${nodes.length + 1}`, data: { label: phaseLabel }, position: { x: phaseXOffset, y: yOffset } };
      nodes.push(currentPhase);
    } else if (line.startsWith('Main Task')) {
      yOffset += 100;
      const mainTaskLabel = line.replace('Main Task', '').trim(); // Remove 'Main Task' and trim the label
      currentMainTask = { id: `task-${nodes.length + 1}`, data: { label: mainTaskLabel }, position: { x: mainTaskXOffset, y: yOffset } };
      nodes.push(currentMainTask);
      if (currentPhase) {
        edges.push({ id: `e-${currentPhase.id}-${currentMainTask.id}`, source: currentPhase.id, target: currentMainTask.id });
      }
    } else if (line.startsWith('Sub-task')) {
      yOffset += 90;
      const subTaskLabel = line.replace('Sub-task', '').trim(); // Remove 'Sub-task' and trim the label
      const subTaskNode = { id: `subtask-${nodes.length + 1}`, data: { label: subTaskLabel }, position: { x: subTaskXOffset, y: yOffset } };
      nodes.push(subTaskNode);
      if (currentMainTask) {
        edges.push({ id: `e-${currentMainTask.id}-${subTaskNode.id}`, source: currentMainTask.id ? currentMainTask.id : currentPhase.id, target: subTaskNode.id, animated: true });
      }
    } 
  });

  return { nodes, edges };
};


const md = new Remarkable();

function markdownToPlainText(markdown) {
  // Remove headers
  markdown = markdown.replace(/^#{1,6}\s+/gm, '');
  // Remove emphasis (italic and bold)
  markdown = markdown.replace(/(\*\*|__)(.*?)\1/g, '$2');
  markdown = markdown.replace(/(\*|_)(.*?)\1/g, '$2');
  // Remove strikethrough
  markdown = markdown.replace(/~~(.*?)~~/g, '$1');
  // Remove inline code
  markdown = markdown.replace(/`(.*?)`/g, '$1');
  // Remove links but keep the text
  markdown = markdown.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  // Remove images but keep the alt text
  markdown = markdown.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1');
  // Remove blockquotes
  markdown = markdown.replace(/^>\s+/gm, '');
  // Remove horizontal rules
  markdown = markdown.replace(/^---$/gm, '');
  // Remove lists
  markdown = markdown.replace(/^\s*[-*+]\s+/gm, '');
  markdown = markdown.replace(/^\s*\d+\.\s+/gm, '');
  // Remove code blocks
  markdown = markdown.replace(/```[\s\S]*?```/g, '');
  // Remove HTML tags
  markdown = markdown.replace(/<\/?[^>]+(>|$)/g, '');
  
  return markdown;
}


function Roadmap() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('')
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const socket = useSocket();
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const [finalText, setFinalText] = useState("");
  const {startLoading, finishLoading} = useLoading();

  const handleGenerateRoadmap = () => {
    const { nodes, edges } = parseRoadmap(outputText);
    setNodes(nodes);
    setEdges(edges);
  };

  useEffect(() => {
    if (socket) {
      socket.on('prompt-response-roadmap', data => {
        // Convert Markdown to plain text
        const plainText = data.text ;
        // Append the plain text to the existing input text
        const newText = outputText + plainText;
        // Split the text into lines
        const lines = newText.split('\n').filter(line => line.trim() !== '');
        // Remove duplicate lines
        const uniqueLines = [...new Set(lines)];
        // Join the unique lines back into a single text
        const uniqueText = uniqueLines.join('\n');
        // Update the input text state
        setFinalText(uniqueText)
        setOutputText(markdownToPlainText(uniqueText));
        handleGenerateRoadmap()
      });

      socket.on('prompt-response-end-roadmap', text=>{
        //console.log(text)
        finishLoading();
        setFinalText(text);
      })

    }
  }, [socket, outputText]);

  return (
    <div style={{ height: '83vh' }}>
      <div style={{ display: 'flex' }}>
        <TextField
          variant='outlined'
          label="Tell me a topic to generate its Roadmap"
          fullWidth
          multiline
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <IconButton onClick={()=>{
          startLoading();
          socket.emit('process-prompt', {
            feature : 'roadmap',
            topic : inputText,
            prompt_type  : 'text'
          })
        }}>
          <AutoAwesomeIcon />
        </IconButton>
        
      </div>
      <Grid container height={'83vh'}>
        <Grid item md={6} xs={12}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Controls />
          </ReactFlow>
        </Grid>

        <Grid item md={6} xs={12}>
          <Card style={{ marginTop: '10px' }}>
            <CardContent>
              <ReactMarkdown>
                {finalText}
              </ReactMarkdown>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Roadmap;