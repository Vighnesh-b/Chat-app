import { useState } from 'react'
import './styles.css'
import Login from './Autentication/Login'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Login/>
      </div>
    </>
  )
}

export default App
