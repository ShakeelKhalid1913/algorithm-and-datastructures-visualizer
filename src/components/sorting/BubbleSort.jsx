import { useState, useCallback, useEffect } from 'react'
import ReactFlow, { Background, Controls } from 'reactflow'
import { Button, TextField, Box, Stack, Typography } from '@mui/material'
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import ArrayNode from '../ArrayNode'

const nodeTypes = {
  arrayNode: ArrayNode,
}

const BubbleSort = () => {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [compareIndex, setCompareIndex] = useState(-1)
  const [sortedUntil, setSortedUntil] = useState(array.length)
  const [sorting, setSorting] = useState(false)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [result, setResult] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  const createNodes = useCallback(() => {
    const newNodes = array.map((value, index) => ({
      id: `${index}`,
      position: { x: index * 150 + 100, y: 150 },
      data: { 
        label: value,
        isHighlighted: index === currentIndex,
        isComparing: index === compareIndex,
        isSorted: index >= sortedUntil
      },
      type: 'arrayNode'
    }))
    setNodes(newNodes)
  }, [array, currentIndex, compareIndex, sortedUntil])

  const generateSteps = () => {
    const steps = []
    const tempArray = [...array]
    
    for (let i = 0; i < tempArray.length - 1; i++) {
      for (let j = 0; j < tempArray.length - i - 1; j++) {
        // Add comparison step
        steps.push({
          type: 'compare',
          indices: [j, j + 1],
          values: [tempArray[j], tempArray[j + 1]],
          sortedUntil: tempArray.length - i - 1,
          array: [...tempArray]
        })
        
        if (tempArray[j] > tempArray[j + 1]) {
          // Add swap step
          const temp = tempArray[j]
          tempArray[j] = tempArray[j + 1]
          tempArray[j + 1] = temp
          steps.push({
            type: 'swap',
            indices: [j, j + 1],
            values: [tempArray[j], tempArray[j + 1]],
            sortedUntil: tempArray.length - i - 1,
            array: [...tempArray]
          })
        }
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
      setCurrentIndex(step.indices[0])
      setCompareIndex(step.indices[1])
      setSortedUntil(step.sortedUntil)
      setArray(step.array)
      
      if (step.type === 'compare') {
        setResult(`Comparing ${step.values[0]} with ${step.values[1]}`)
      } else {
        setResult(`Swapped ${step.values[1]} with ${step.values[0]}`)
      }
    }
    
    // Add final step completion check
    if (currentStep === steps.length - 2) { // One step before last
      setCurrentIndex(-1)
      setCompareIndex(-1)
      setSortedUntil(0)
      setSorting(false) // Reset sorting state
      setResult('Array sorted!')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      const step = steps[prevStep]
      
      setCurrentStep(prevStep)
      setCurrentIndex(step.indices[0])
      setCompareIndex(step.indices[1])
      setSortedUntil(step.sortedUntil)
      setArray(step.array)
      
      if (step.type === 'compare') {
        setResult(`Comparing ${step.values[0]} with ${step.values[1]}`)
      } else {
        setResult(`Swapped ${step.values[1]} with ${step.values[0]}`)
      }
    } else if (currentStep === 0) {
      setCurrentStep(-1)
      setCurrentIndex(-1)
      setCompareIndex(-1)
      setSortedUntil(array.length)
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
          setSortedUntil(0)
          setSorting(false) // Reset sorting state
          setResult('Array sorted!')
        }
        return
      }

      const nextStep = current + 1
      const step = steps[nextStep]
      
      setCurrentStep(nextStep)
      setCurrentIndex(step.indices[0])
      setCompareIndex(step.indices[1])
      setSortedUntil(step.sortedUntil)
      setArray(step.array)
      
      if (step.type === 'compare') {
        setResult(`Comparing ${step.values[0]} with ${step.values[1]}`)
      } else {
        setResult(`Swapped ${step.values[1]} with ${step.values[0]}`)
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
    setSortedUntil(array.length)
    setSteps([])
    setCurrentStep(-1)
    setSorting(false)
  }

  useEffect(() => {
    createNodes()
  }, [array, currentIndex, compareIndex, sortedUntil, createNodes])

  return (
    <Box sx={{ height: '500px', width: '100%' }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Add Number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="number"
          disabled={sorting}
        />
        <Button 
          variant="contained" 
          onClick={handleAdd}
          disabled={sorting || !inputValue}
        >
          Add
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSort}
          disabled={sorting}
          color="primary"
        >
          Start Sort
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleReset}
          disabled={isAutoPlaying} // Only disable during auto-play
        >
          Reset
        </Button>
      </Stack>

      {sorting && (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }} justifyContent="center" alignItems="center">
          <Button
            variant="contained"
            onClick={handlePrevious}
            disabled={currentStep <= -1 || isAutoPlaying}
            startIcon={<ArrowBack />}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={currentStep >= steps.length - 1 || isAutoPlaying}
            endIcon={<ArrowForward />}
          >
            Next
          </Button>
          <Button
            variant="contained"
            onClick={handleAutoPlay}
            disabled={currentStep >= steps.length - 1}
            color={isAutoPlaying ? "error" : "secondary"}
          >
            {isAutoPlaying ? "Stop" : "Auto Play"}
          </Button>
        </Stack>
      )}
      
      {result && (
        <Typography sx={{ mb: 2 }} color="primary" align="center" variant="h6">
          {result}
        </Typography>
      )}
      
      <Box sx={{ height: '400px', border: '1px solid #ccc' }}>
        <ReactFlow 
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </Box>
    </Box>
  )
}

export default BubbleSort
