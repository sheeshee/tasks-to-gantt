import { useState } from 'react'
import './App.css'
import { Header } from './Header'
import { DragAndDrop } from './FileLoader'
import { Gantt } from './Gantt'

export default function App() {
  const [tasks, setTasks] = useState(undefined)
  return (
    <div className="App">
      <Header />
      {tasks ? <Gantt tasks={tasks} /> : <DragAndDrop setTasks={setTasks} />}
    </div>
  )
}
