import { useState, useCallback, useEffect } from 'react'
import ReactFlow, { Background, Controls } from 'reactflow'
import { Button, TextField, Box, Stack, Typography, useTheme, useMediaQuery } from '@mui/material'
import ArrayNode from '../ArrayNode'
import 'reactflow/dist/style.css'

const nodeTypes = {
  arrayNode: ArrayNode,
}

const SelectionSort = () => {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [compareIndex, setCompareIndex] = useState(-1)
  const [minIndex, setMinIndex] = useState(-1)
  const [sortedUntil, setSortedUntil] = useState(0)
  const [sorting, setSorting] = useState(false)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [result, setResult] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
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
        isComparing: index === compareIndex,
        isSorted: index < sortedUntil,
        isMin: index === minIndex
      },
      type: 'arrayNode'
    }))
    setNodes(newNodes)
  }, [array, currentIndex, compareIndex, sortedUntil, minIndex, isMobile])

  const generateSteps = () => {
    const steps = []
    const tempArray = [...array]
    
    for (let i = 0; i < tempArray.length - 1; i++) {
      let minIdx = i
      
      // Add step for starting new pass
      steps.push({
        type: 'start_pass',
        currentIndex: i,
        minIndex: minIdx,
        sortedUntil: i,
        array: [...tempArray],
        message: `Starting new pass from index ${i}`
      })
      
      for (let j = i + 1; j < tempArray.length; j++) {
        // Add comparison step
        steps.push({
          type: 'compare',
          currentIndex: i,
          compareIndex: j,
          minIndex: minIdx,
          sortedUntil: i,
          array: [...tempArray],
          message: `Comparing ${tempArray[j]} with current minimum ${tempArray[minIdx]}`
        })
        
        if (tempArray[j] < tempArray[minIdx]) {
          minIdx = j
          // Add new minimum step
          steps.push({
            type: 'new_min',
            currentIndex: i,
            minIndex: minIdx,
            sortedUntil: i,
            array: [...tempArray],
            message: `New minimum found: ${tempArray[j]} at index ${j}`
          })
        }
      }
      
      if (minIdx !== i) {
        // Add swap step
        const temp = tempArray[i]
        tempArray[i] = tempArray[minIdx]
        tempArray[minIdx] = temp
        steps.push({
          type: 'swap',
          currentIndex: i,
          minIndex: minIdx,
          sortedUntil: i + 1,
          array: [...tempArray],
          message: `Swapping ${temp} with ${tempArray[i]}`
        })
      } else {
        steps.push({
          type: 'no_swap',
          currentIndex: i,
          minIndex: minIdx,
          sortedUntil: i + 1,
          array: [...tempArray],
          message: `${tempArray[i]} is already in correct position`
        })
      }
    }
    
    return steps
  }

  const handleSort = () => {
    if (sorting) return
    setSorting(true)
    const newSteps = generateSteps()
    setSteps(newSteps)
    setCurrentStep(-1)
    setResult('Press Next to start sorting')
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1
      const step = steps[nextStep]
      
      setCurrentStep(nextStep)
      setCurrentIndex(step.currentIndex)
      setMinIndex(step.minIndex)
      setSortedUntil(step.sortedUntil)
      setArray(step.array)
      setResult(step.message)
      
      if (step.type === 'compare') {
        setCompareIndex(step.compareIndex)
      } else {
        setCompareIndex(-1)
      }
    }
    
    // Add final step completion check
    if (currentStep === steps.length - 2) { // One step before last
      setCurrentIndex(-1)
      setCompareIndex(-1)
      setMinIndex(-1)
      setSortedUntil(array.length)
      setSorting(false) // Reset sorting state
      setResult('Array sorted!')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      const step = steps[prevStep]
      
      setCurrentStep(prevStep)
      setCurrentIndex(step.currentIndex)
      setMinIndex(step.minIndex)
      setSortedUntil(step.sortedUntil)
      setArray(step.array)
      setResult(step.message)
      
      if (step.type === 'compare') {
        setCompareIndex(step.compareIndex)
      } else {
        setCompareIndex(-1)
      }
    } else if (currentStep === 0) {
      setCurrentStep(-1)
      setCurrentIndex(-1)
      setCompareIndex(-1)
      setMinIndex(-1)
      setSortedUntil(0)
      setArray(steps[0].array)
      setResult('Press Next to start sorting')
    }
  }

  const handleAutoPlay = async () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false)
      return
    }

    setIsAutoPlaying(true)
    let current = currentStep

    const playNextStep = async () => {
      if (!isAutoPlaying || current >= steps.length - 1) {
        setIsAutoPlaying(false)
        if (current >= steps.length - 1) {
          setCurrentIndex(-1)
          setCompareIndex(-1)
          setMinIndex(-1)
          setSortedUntil(array.length)
          setSorting(false) // Reset sorting state
          setResult('Array sorted!')
        }
        return
      }

      const nextStep = current + 1
      const step = steps[nextStep]
      
      setCurrentStep(nextStep)
      setCurrentIndex(step.currentIndex)
      setMinIndex(step.minIndex)
      setSortedUntil(step.sortedUntil)
      setArray(step.array)
      setResult(step.message)
      
      if (step.type === 'compare') {
        setCompareIndex(step.compareIndex)
      } else {
        setCompareIndex(-1)
      }
      
      current = nextStep
      
      // Schedule next step
      setTimeout(() => playNextStep(), 1000)
    }

    // Start the playback
    playNextStep()
  }

  const handleAdd = () => {
    if (inputValue && !sorting) {
      const newValue = parseInt(inputValue)
      setArray([...array, newValue])
      setResult(`Added ${newValue} at the end`)
      setInputValue('')
    }
  }

  const handleReset = () => {
    // Stop auto-play if it's running
    setIsAutoPlaying(false)
    
    setArray([64, 34, 25, 12, 22, 11, 90])
    setResult('Reset to initial array')
    setCurrentIndex(-1)
    setCompareIndex(-1)
    setMinIndex(-1)
    setSortedUntil(0)
    setSteps([])
    setCurrentStep(-1)
    setSorting(false)
  }

  useEffect(() => {
    createNodes()
  }, [createNodes])

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
          disabled={sorting}
        />
        <Button 
          variant="contained" 
          onClick={handleAdd}
          disabled={sorting || !inputValue}
          size={isMobile ? "small" : "medium"}
          fullWidth={isMobile}
        >
          Add
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSort}
          disabled={sorting}
          color="primary"
          size={isMobile ? "small" : "medium"}
          fullWidth={isMobile}
        >
          Start Sort
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleReset}
          disabled={isAutoPlaying}
          size={isMobile ? "small" : "medium"}
          fullWidth={isMobile}
        >
          Reset
        </Button>
      </Stack>

      {sorting && (
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={2} 
          sx={{ mb: 2 }}
        >
          <Button
            variant="contained"
            onClick={handlePrevious}
            disabled={currentStep <= 0 || isAutoPlaying}
            size={isMobile ? "small" : "medium"}
            fullWidth={isMobile}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={currentStep >= steps.length - 1 || isAutoPlaying}
            size={isMobile ? "small" : "medium"}
            fullWidth={isMobile}
          >
            Next
          </Button>
          <Button
            variant="contained"
            onClick={handleAutoPlay}
            color={isAutoPlaying ? "error" : "primary"}
            size={isMobile ? "small" : "medium"}
            fullWidth={isMobile}
          >
            {isAutoPlaying ? "Stop" : "Auto Play"}
          </Button>
        </Stack>
      )}

      <Typography 
        variant={isMobile ? "body2" : "body1"} 
        sx={{ mb: 2, color: 'black' }}
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

export default SelectionSort
