import React, { Component } from 'react'
import { gantt } from 'dhtmlx-gantt'

import { Task } from './types/Task'

import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import './Gantt.css'

// const data = {
//     data: [
//         { id: 1, text: 'Task #1', start_date: '15-04-2019', duration: 10, progress: 0.6 },
//         { id: 2, text: 'Task #2', start_date: '18-04-2019', duration: 3, progress: 0.4 }
//     ],
//     links: [
//         { id: 1, source: 1, target: 2, type: '0' }
//     ]
// };

export default class Gantt extends Component {
  componentDidMount () {
    gantt.init(this.ganttContainer)
    gantt.config.readonly = true
    gantt.config.columns = [
      { name: 'text', label: 'Task name', width: 150 },
      { name: 'holder', label: 'Assignee', align: 'center', width: 80 },
      { name: 'start_date', label: 'Start time', align: 'center', width: 80 }
    ]
  }

  render () {
    gantt.parse(this.props.tasks ? this.props.tasks : { data: [] })
    return (
           <div className={this.props.tasks ? 'gantt' : 'hidden'}
                ref={ (input) => { this.ganttContainer = input } }
            ></div>
    )
  }
}

Gantt.propTypes = {
  tasks: Task
}
