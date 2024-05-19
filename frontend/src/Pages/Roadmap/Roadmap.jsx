import { Card, CardContent, Grid, Icon, IconButton, TextField } from '@mui/material';
import React, { useCallback } from 'react';
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

const initialNodes = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 0, y: 0 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

function Roadmap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{ height: '83vh' }}>
      <div style={{
        display : "flex"
      }}>

      <TextField variant='outlined' label="Tell me a topic to generate it's Roadmap" fullWidth />
      <IconButton>
        <Icon>
          <AutoAwesomeIcon />
        </Icon>
      </IconButton>
      </div>
      <Grid container height={'83vh'}>
        <Grid item md = {6} xs = {12}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>

        </Grid>

        <Grid item md = {6} xs = {12}>
          <Card style={{
            marginTop : "10px"
          }}>
            <CardContent>
              This is Ai response
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Roadmap;
