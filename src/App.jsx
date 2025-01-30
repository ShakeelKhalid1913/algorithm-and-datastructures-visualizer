import { useState } from 'react'
import { Tabs, Tab, Typography, Paper, useMediaQuery, useTheme } from '@mui/material'
import 'reactflow/dist/style.css'
import './App.css'
import LinearSearch from './components/searching/LinearSearch'
import BinarySearch from './components/searching/BinarySearch'
import InsertionSort from './components/sorting/InsertionSort'
import BubbleSort from './components/sorting/BubbleSort'
import SelectionSort from './components/sorting/SelectionSort'
import LinkedList from './components/data-structures/LinkedList'
import ArrayComponent from './components/data-structures/ArrayComponent'

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && children}
    </div>
  )
}

function App() {
  const [category, setCategory] = useState(0)
  const [searchAlgo, setSearchAlgo] = useState(0)
  const [sortAlgo, setSortAlgo] = useState(0)
  const [dataStructure, setDataStructure] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const renderSortingAlgorithm = () => {
    switch(sortAlgo) {
      case 0:
        return <InsertionSort />
      case 1:
        return <BubbleSort />
      case 2:
        return <SelectionSort />
      default:
        return null
    }
  }

  const categories = [
    {
      name: 'Searching Algorithms',
      subcategories: [
        { name: 'Linear Search', component: LinearSearch },
        { name: 'Binary Search', component: BinarySearch },
      ],
    },
    {
      name: 'Sorting Algorithms',
      subcategories: [
        { name: 'Bubble Sort', component: BubbleSort },
        { name: 'Selection Sort', component: SelectionSort },
        { name: 'Insertion Sort', component: InsertionSort },
      ],
    },
    {
      name: 'Data Structures',
      subcategories: [
        { name: 'Array', component: ArrayComponent },
        { name: 'Linked List', component: LinkedList },
      ],
    },
  ]

  return (
    <div className="app">
      <Typography 
        // add color
        color="primary"
        variant={isMobile ? "h5" : "h3"} 
        component="h1" 
        sx={{ mb: 3, mt: 2 }}
      >
        Algorithm and Data Structures Visualizer
      </Typography>

      <Paper elevation={3} sx={{ mb: 3 }}>
        <Tabs 
          value={category} 
          onChange={(e, v) => setCategory(v)}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab label="Searching Algorithms" />
          <Tab label="Sorting Algorithms" />
          <Tab label="Data Structures" />
        </Tabs>
      </Paper>

      <TabPanel value={category} index={0}>
        <Paper elevation={3} sx={{ mb: 3 }}>
          <Tabs 
            value={searchAlgo} 
            onChange={(e, v) => setSearchAlgo(v)}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
          >
            <Tab label="Linear Search" />
            <Tab label="Binary Search" />
          </Tabs>
        </Paper>
        <div className="visualization-container">
          {searchAlgo === 0 ? <LinearSearch /> : <BinarySearch />}
        </div>
      </TabPanel>

      <TabPanel value={category} index={1}>
        <Paper elevation={3} sx={{ mb: 3 }}>
          <Tabs 
            value={sortAlgo} 
            onChange={(e, v) => setSortAlgo(v)}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
          >
            <Tab label="Insertion Sort" />
            <Tab label="Bubble Sort" />
            <Tab label="Selection Sort" />
          </Tabs>
        </Paper>
        <div className="visualization-container">
          {renderSortingAlgorithm()}
        </div>
      </TabPanel>

      <TabPanel value={category} index={2}>
        <Paper elevation={3} sx={{ mb: 3 }}>
          <Tabs 
            value={dataStructure} 
            onChange={(e, v) => setDataStructure(v)}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
          >
            <Tab label="Array" />
            <Tab label="Linked List" />
          </Tabs>
        </Paper>
        <div className="visualization-container">
          {dataStructure === 0 ? <ArrayComponent /> : <LinkedList />}
        </div>
      </TabPanel>
    </div>
  )
}

export default App
