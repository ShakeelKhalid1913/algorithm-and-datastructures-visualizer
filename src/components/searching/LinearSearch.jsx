import { useState, useCallback, useEffect } from 'react'
import ReactFlow, { Background, Controls } from 'reactflow'
import { Button, TextField, Box, Stack, Typography, useTheme, useMediaQuery } from '@mui/material'
import ArrayNode from '../ArrayNode'
import 'reactflow/dist/style.css'

const nodeTypes = {
  arrayNode: ArrayNode,
}

const LinearSearch = () => {
  const [array, setArray] = useState([4, 2, 7, 1, 9, 5])
  const [searchValue, setSearchValue] = useState('')
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [found, setFound] = useState(false)
  const [searching, setSearching] = useState(false)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
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
        isHighlighted: index === currentIndex,
        isTarget: value === parseInt(searchValue) && index === currentIndex && found
      },
      type: 'arrayNode'
    }))
    setNodes(newNodes)
  }, [array, currentIndex, searchValue, found, isMobile])

  const handleSearch = async () => {
    if (!searchValue || searching) return
    
    setSearching(true)
    setFound(false)
    setCurrentIndex(-1)
    setResult('')
    
    const target = parseInt(searchValue)
    
    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (array[i] === target) {
        setFound(true)
        setResult(`Found ${target} at index ${i}`)
        setSearching(false)
        return
      }
    }
    
    setCurrentIndex(-1)
    setResult(`${target} not found in the array`)
    setSearching(false)
  }

  const handleAdd = () => {
    if (searchValue && !searching) {
      const newValue = parseInt(searchValue)
      setArray([...array, newValue])
      setResult(`Added ${newValue} at index ${array.length} (end of array)`)
      setSearchValue('')
    }
  }

  const handleRemove = () => {
    if (searchValue && !searching) {
      const target = parseInt(searchValue)
      const index = array.indexOf(target)
      if (index !== -1) {
        setArray(array.filter(num => num !== target))
        setResult(`Removed ${target} from index ${index}`)
      } else {
        setResult(`Value ${target} not found in array`)
      }
      setSearchValue('')
    }
  }

  useEffect(() => {
    createNodes()
  }, [array, currentIndex, searchValue, found, createNodes])

  return (
    <Box sx={{ height: '500px', width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Linear Search</Typography>
      <Stack 
        direction={isMobile ? "column" : "row"} 
        spacing={2} 
        sx={{ mb: 2 }}
      >
        <TextField
          label="Value"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          type="number"
          size={isMobile ? "small" : "medium"}
          fullWidth={isMobile}
          disabled={searching}
        />
        <Button 
          variant="contained" 
          onClick={handleSearch}
          disabled={searching || !searchValue}
          color="primary"
          size={isMobile ? "small" : "medium"}
          fullWidth={isMobile}
        >
          Search
        </Button>
        <Button 
          variant="contained" 
          onClick={handleAdd}
          disabled={searching || !searchValue}
          size={isMobile ? "small" : "medium"}
          fullWidth={isMobile}
        >
          Add
        </Button>
        <Button 
          variant="contained" 
          onClick={handleRemove}
          disabled={searching || !searchValue}
          size={isMobile ? "small" : "medium"}
          fullWidth={isMobile}
        >
          Remove
        </Button>
      </Stack>

      {result && (
        <Typography 
          variant={isMobile ? "body2" : "body1"} 
          sx={{ mb: 2, color: 'black' }}
          color={found ? "success.main" : "error.main"}
        >
          {result}
        </Typography>
      )}

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

export default LinearSearch
