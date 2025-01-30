import { useState, useCallback, useEffect } from 'react'
import ReactFlow, { Background, Controls } from 'reactflow'
import { Button, TextField, Box, Stack, Typography } from '@mui/material'
import ArrayNode from '../ArrayNode'
import 'reactflow/dist/style.css'

const nodeTypes = {
  arrayNode: ArrayNode,
}

const ArrayComponent = () => {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90])
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [result, setResult] = useState('')

  const createNodes = useCallback(() => {
    const newNodes = array.map((value, index) => ({
      id: `${index}`,
      position: { x: index * 150 + 100, y: 150 },
      data: { 
        label: value,
        isHighlighted: false,
        isComparing: false,
        isSorted: false
      },
      type: 'arrayNode'
    }))
    setNodes(newNodes)
  }, [array])

  useEffect(() => {
    createNodes()
  }, [createNodes])

  const handleAdd = () => {
    if (inputValue) {
      setArray([...array, parseInt(inputValue)])
      setInputValue('')
      setResult(`Added ${inputValue} to the array`)
    }
  }

  const handleRemove = () => {
    if (array.length > 0) {
      const newArray = array.slice(0, -1)
      setArray(newArray)
      setResult('Removed last element from the array')
    }
  }

  const handleReset = () => {
    setArray([64, 34, 25, 12, 22, 11, 90])
    setInputValue('')
    setResult('Reset array to initial state')
  }

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
          Add Element
        </Button>
        <Button 
          variant="contained" 
          onClick={handleRemove}
          disabled={array.length === 0}
          color="error"
        >
          Remove Last
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleReset}
          disabled={array.length === 0}
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
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </Box>
  )
}

export default ArrayComponent
