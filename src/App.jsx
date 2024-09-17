import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CrudTable from './CrudTable'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <CrudTable/>
    </>
  )
}

export default App
