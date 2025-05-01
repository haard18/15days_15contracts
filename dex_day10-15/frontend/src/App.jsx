import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from 'react-router-dom'
import Faucet from './Pages/Faucet'
import Events from './Pages/Events'
import Pool from './Pages/Pool'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Faucet/>}/>
        <Route path="/events" element={<Events/>} />
        <Route path="/pool" element={<Pool/>} />
      </Routes>
    </Router>

    </>
  )
}

export default App
