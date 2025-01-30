import { useState, useCallback, useEffect } from 'react'
import ReactFlow, { 
  Background, 
  Controls, 
  MarkerType, 
  Position,
  useNodesState,
  useEdgesState
} from 'reactflow'
import { Button, TextField, Box, Stack, Typography, useTheme, useMediaQuery } from '@mui/material'
import 'reactflow/dist/style.css'

const LinkedList = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [inputValue, setInputValue] = useState('')
  const [list, setList] = useState([])
  const [result, setResult] = useState('')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const createNodes = useCallback(() => {
    const nodeSpacing = isMobile ? 150 : 200
    const nodeWidth = isMobile ? 60 : 80
    const fontSize = isMobile ? 14 : 18
    const padding = isMobile ? 10 : 15

    const newNodes = list.map((value, index) => ({
      id: `${index}`,
      position: { x: index * nodeSpacing + 50, y: 150 },
      draggable: true,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: { 
        label: (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            padding: `${padding}px`,
            border: '2px solid #4CAF50',
            borderRadius: '8px',
            background: 'white',
            minWidth: `${nodeWidth}px`
          }}>
            <div style={{ fontSize: `${fontSize}px`, fontWeight: 'bold' }}>{value}</div>
          </div>
        )
      },
      style: {
        background: 'transparent',
        border: 'none'
      }
    }))
    setNodes(newNodes)

    const newEdges = list.slice(0, -1).map((_, index) => ({
      id: `e${index}-${index + 1}`,
      source: `${index}`,
      target: `${index + 1}`,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#4CAF50', strokeWidth: isMobile ? 1 : 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#4CAF50',
        width: isMobile ? 15 : 20,
        height: isMobile ? 15 : 20
      }
    }))
    setEdges(newEdges)
  }, [list, isMobile, setNodes, setEdges])

  useEffect(() => {
    createNodes()
  }, [createNodes])

  const handleAdd = () => {
    if (inputValue) {
      setList([...list, parseInt(inputValue)])
      setInputValue('')
      setResult(`Added ${inputValue} to the linked list`)
    }
  }

  const handleRemove = () => {
    if (list.length > 0) {
      const newList = list.slice(0, -1)
      setList(newList)
      setResult('Removed last node from the linked list')
    }
  }

  const handleReset = () => {
    setList([])
    setInputValue('')
    setResult('Reset linked list')
  }

  return (
    <Box sx={{ height: '500px', width: '100%' }}>
      <Stack 
        direction={isMobile ? "column" : "row"} 
        spacing={2} 
        sx={{ mb: 2 }}
      >
        <TextField
          label="Add Number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="number"
          size={isMobile ? "small" : "medium"}
          fullWidth={isMobile}
        />
        <Button 
          variant="contained" 
          onClick={handleAdd}
          disabled={!inputValue}
          size={isMobile ? "small" : "medium"}
          fullWidth={isMobile}
        >
          Add Node
        </Button>
        <Button 
          variant="contained" 
          onClick={handleRemove}
          disabled={list.length === 0}
          color="error"
          size={isMobile ? "small" : "medium"}
          fullWidth={isMobile}
        >
          Remove Last
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleReset}
          disabled={list.length === 0}
          size={isMobile ? "small" : "medium"}
          fullWidth={isMobile}
        >
          Reset
        </Button>
      </Stack>

      <Typography 
        variant={isMobile ? "body2" : "body1"} 
        sx={{ mb: 2 }}
      >
        {result}
      </Typography>

      <div style={{ height: isMobile ? 300 : 400 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          minZoom={0.2}
          maxZoom={4}
        >
          <Background />
          <Controls 
            showZoom={!isMobile}
            showFitView={!isMobile}
            showInteractive={!isMobile}
          />
        </ReactFlow>
      </div>
    </Box>
  )
}

export default LinkedList
