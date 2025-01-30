import { useState, useCallback, useEffect } from 'react'
import ReactFlow, { Background, Controls } from 'reactflow'
import { Button, TextField, Box, Stack, Typography, useTheme, useMediaQuery } from '@mui/material'
import ArrayNode from '../ArrayNode'
import 'reactflow/dist/style.css'

const nodeTypes = {
  arrayNode: ArrayNode,
}

const BinarySearch = () => {
  const [array, setArray] = useState([1, 2, 4, 5, 7, 9])
  const [searchValue, setSearchValue] = useState('')
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [leftIndex, setLeftIndex] = useState(-1)
  const [rightIndex, setRightIndex] = useState(-1)
  const [found, setFound] = useState(false)
  const [searching, setSearching] = useState(false)
  const [nodes, setNodes] = useState([])
  const [edges] = useState([])
  const [result, setResult] = useState('')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const createNodes = useCallback(() => {
    const nodeSpacing = isMobile ? 100 : 150
    const newNodes = array.map((value, index) => ({
      id: `${index}`,
      position: { x: index * nodeSpacing + 100, y: 150 },
      data: { 
        label: value,
        isHighlighted: index === currentIndex,
        isTarget: value === parseInt(searchValue) && index === currentIndex && found,
        isBoundary: (index === leftIndex || index === rightIndex) && leftIndex !== -1 && rightIndex !== -1
      },
      type: 'arrayNode'
    }))
    setNodes(newNodes)
  }, [array, currentIndex, searchValue, found, leftIndex, rightIndex, isMobile])

  const handleSearch = async () => {
    if (!searchValue || searching) return
    
    setSearching(true)
    setFound(false)
    setCurrentIndex(-1)
    setLeftIndex(0)
    setRightIndex(array.length - 1)
    setResult('')
    
    const target = parseInt(searchValue)
    let left = 0
    let right = array.length - 1
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      setCurrentIndex(mid)
      setLeftIndex(left)
      setRightIndex(right)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (array[mid] === target) {
        setFound(true)
        setResult(`Found ${target} at index ${mid}`)
        setSearching(false)
        return
      }
      
      if (array[mid] < target) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }
    
    setCurrentIndex(-1)
    setLeftIndex(-1)
    setRightIndex(-1)
    setResult(`${target} not found in the array`)
    setSearching(false)
  }

  const handleAdd = () => {
    if (searchValue && !searching) {
      const newValue = parseInt(searchValue)
      const newArray = [...array]
      let insertIndex = 0
      
      // Find the correct position to insert while maintaining sorted order
      while (insertIndex < newArray.length && newArray[insertIndex] < newValue) {
        insertIndex++
      }
      
      newArray.splice(insertIndex, 0, newValue)
      setArray(newArray)
      setResult(`Added ${newValue} at index ${insertIndex} (${
        insertIndex === 0 ? 'start of array' : 
        insertIndex === newArray.length - 1 ? 'end of array' : 
        `between ${newArray[insertIndex-1]} and ${newArray[insertIndex+1]}`
      })`)
      setSearchValue('')
    }
  }

  const handleRemove = () => {
    if (searchValue && !searching) {
      const target = parseInt(searchValue)
      const index = array.indexOf(target)
      if (index !== -1) {
        setArray(array.filter(num => num !== target))
        setResult(`Removed ${target} from index ${index} (between ${
          index === 0 ? 'start' : array[index-1]
        } and ${
          index === array.length-1 ? 'end' : array[index+1]
        })`)
      } else {
        setResult(`Value ${target} not found in array`)
      }
      setSearchValue('')
    }
  }

  useEffect(() => {
    createNodes()
  }, [array, currentIndex, searchValue, found, leftIndex, rightIndex, createNodes])

  return (
    <Box sx={{ height: '500px', width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Binary Search</Typography>
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

export default BinarySearch
