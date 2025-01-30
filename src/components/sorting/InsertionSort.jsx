import { useState, useCallback, useEffect } from 'react'
import ReactFlow, { Background, Controls } from 'reactflow'
import { Button, TextField, Box, Stack, Typography } from '@mui/material'
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import ArrayNode from '../ArrayNode'

const nodeTypes = {
  arrayNode: ArrayNode,
}

const InsertionSort = () => {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [compareIndex, setCompareIndex] = useState(-1)
  const [sortedUntil, setSortedUntil] = useState(0)
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
        isSorted: index < sortedUntil
      },
      type: 'arrayNode'
    }))
    setNodes(newNodes)
  }, [array, currentIndex, compareIndex, sortedUntil])

  const generateSteps = () => {
    const steps = []
    const tempArray = [...array]
    
    // Add initial explanation step
    steps.push({
      type: 'initial',
      currentIndex: -1,
      compareIndex: -1,
      sortedUntil: 1,
      array: [...tempArray],
      message: `First element (${tempArray[0]}) is considered sorted as a single element is always sorted`
    })
    
    for (let i = 1; i < tempArray.length; i++) {
      const key = tempArray[i]
      
      // Add step for selecting key
      steps.push({
        type: 'select_key',
        currentIndex: i,
        compareIndex: -1,
        sortedUntil: i,
        array: [...tempArray],
        message: `Selected ${key} as key to insert into sorted portion`
      })
      
      let j = i - 1
      
      while (j >= 0 && tempArray[j] > key) {
        // Add comparison step
        steps.push({
          type: 'compare',
          currentIndex: i,
          compareIndex: j,
          sortedUntil: i,
          array: [...tempArray],
          message: `Comparing ${key} with ${tempArray[j]}`
        })
        
        // Add shift step
        tempArray[j + 1] = tempArray[j]
        steps.push({
          type: 'shift',
          currentIndex: i,
          compareIndex: j,
          sortedUntil: i,
          array: [...tempArray],
          message: `Shifting ${tempArray[j]} to the right`
        })
        
        j--
      }
      
      // Add insert step
      tempArray[j + 1] = key
      steps.push({
        type: 'insert',
        currentIndex: j + 1,
        compareIndex: -1,
        sortedUntil: i + 1,
        array: [...tempArray],
        message: `Inserted ${key} at position ${j + 1}`
      })
    }
    
    return steps
  }

  const handleSort = () => {
    if (sorting) return
    setSorting(true)
    const newSteps = generateSteps()
    setSteps(newSteps)
    setCurrentStep(-1)
    setResult('In Insertion Sort, we start with first element as sorted. Press Next to continue.')
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1
      const step = steps[nextStep]
      
      setCurrentStep(nextStep)
      setCurrentIndex(step.currentIndex)
      setSortedUntil(step.sortedUntil)
      setArray(step.array)
      setResult(step.message)
      
      if (step.type === 'compare' || step.type === 'shift') {
        setCompareIndex(step.compareIndex)
      } else {
        setCompareIndex(-1)
      }
    }
    
    // Add final step completion check
    if (currentStep === steps.length - 2) { // One step before last
      setCurrentIndex(-1)
      setCompareIndex(-1)
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
      setSortedUntil(step.sortedUntil)
      setArray(step.array)
      setResult(step.message)
      
      if (step.type === 'compare' || step.type === 'shift') {
        setCompareIndex(step.compareIndex)
      } else {
        setCompareIndex(-1)
      }
    } else if (currentStep === 0) {
      setCurrentStep(-1)
      setCurrentIndex(-1)
      setCompareIndex(-1)
      setSortedUntil(0)
      setArray(steps[0].array)
      setResult('In Insertion Sort, we start with first element as sorted. Press Next to continue.')
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
      setSortedUntil(step.sortedUntil)
      setArray(step.array)
      setResult(step.message)
      
      if (step.type === 'compare' || step.type === 'shift') {
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
    setSortedUntil(0)
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

export default InsertionSort
