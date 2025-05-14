import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <div className="w-screen h-screen text-white bg-black" onClick={() => setCount(prev => prev += 1)}>{count}</div>
    </>
  )
}

export default App
