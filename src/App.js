import { Component } from 'react'
import './App.css'
import Header from './Header'
import { DragAndDrop } from './FileLoader'
import Gantt from './Gantt'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tasks: undefined
    }
    this.setTasks = this.setTasks.bind(this)
  }

  setTasks (jsonTasks) {
    this.setState({ tasks: jsonTasks })
  }

  render () {
    return (
      <div className="App">
        <Header />
        <DragAndDrop tasks={this.state.tasks} setTasks={this.setTasks} />
        <Gantt tasks={this.state.tasks} />
      </div>
    )
  }
}
export default App
