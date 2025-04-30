import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from 'react-router-dom'
import Faucet from './Pages/Faucet'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Faucet/>}/>

      </Routes>
    </Router>

    </>
  )
}

export default App
