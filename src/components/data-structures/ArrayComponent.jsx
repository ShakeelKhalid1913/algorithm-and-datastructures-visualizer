import { useState, useCallback, useEffect } from 'react'
import ReactFlow, { Background, Controls } from 'reactflow'
import { Button, TextField, Box, Stack, Typography, useTheme, useMediaQuery } from '@mui/material'
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const createNodes = useCallback(() => {
    const nodeSpacing = isMobile ? 100 : 150
    const newNodes = array.map((value, index) => ({
      id: `${index}`,
      position: { x: index * nodeSpacing + 50, y: 150 },
      data: { 
        label: value,
        isHighlighted: false,
        isComparing: false,
        isSorted: false
      },
      type: 'arrayNode'
    }))
    setNodes(newNodes)
  }, [array, isMobile])

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
          Add Element
        </Button>
        <Button 
          variant="contained" 
          onClick={handleRemove}
          disabled={array.length === 0}
          color="error"
          size={isMobile ? "small" : "medium"}
          fullWidth={isMobile}
        >
          Remove Last
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleReset}
          disabled={array.length === 0}
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
          nodeTypes={nodeTypes}
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

export default ArrayComponent
