import { useState, useCallback, useEffect } from 'react'
import ReactFlow, { Background, Controls, MarkerType, Position } from 'reactflow'
import { Button, TextField, Box, Stack, Typography } from '@mui/material'
import 'reactflow/dist/style.css'

const LinkedList = () => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [list, setList] = useState([])
  const [result, setResult] = useState('')

  const createNodes = useCallback(() => {
    const newNodes = list.map((value, index) => ({
      id: `${index}`,
      position: { x: index * 200 + 100, y: 150 },
      draggable: true,
      sourcePosition: Position.Right, 
      targetPosition: Position.Left,  
      data: { 
        label: (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            padding: '15px',
            border: '2px solid #4CAF50',
            borderRadius: '8px',
            background: 'white',
            minWidth: '80px'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{value}</div>
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
      style: { stroke: '#4CAF50', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#4CAF50',
        width: 20,
        height: 20
      }
    }))
    setEdges(newEdges)
  }, [list])

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

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => {
      return nds.map((node) => {
        const change = changes.find((c) => c.id === node.id)
        if (change) {
          return { ...node, position: change.position || node.position }
        }
        return node
      })
    })
  }, [])

  return (
    <Box sx={{ height: '500px', width: '100%' }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Add Number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="number"
        />
        <Button 
          variant="contained" 
          onClick={handleAdd}
          disabled={!inputValue}
        >
          Add Node
        </Button>
        <Button 
          variant="contained" 
          onClick={handleRemove}
          disabled={list.length === 0}
          color="error"
        >
          Remove Last
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleReset}
          disabled={list.length === 0}
        >
          Reset
        </Button>
      </Stack>

      <Typography variant="body1" sx={{ mb: 2 }}>
        {result}
      </Typography>

      <div style={{ height: 400 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </Box>
  )
}

export default LinkedList
