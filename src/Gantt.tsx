import { FC } from 'react'
import { Gantt as BaseGantt, MaterialTheme } from '@dhtmlx/trial-react-gantt'

import { Task } from './types/Task'

import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import './Gantt.css'

// const data = {
//     data: [
// { id: 1, text: 'Task #1', start_date: '15-04-2019', duration: 10, progress: 0.6 },
// { id: 2, text: 'Task #2', start_date: '18-04-2019', duration: 3, progress: 0.4 }
//     ],
//     links: [
//         { id: 1, source: 1, target: 2, type: '0' }
//     ]
// };

interface Props {
  tasks: {
    data: Task[]
  }
}

export const Gantt: FC<Props> = ({ tasks: { data } }) => {
  const tasks = data.map((task) => ({
    ...task,
    id: task['Task ID'],
    startDate: task.start_date
  }))
  const columns = [
    { name: 'text', label: 'Task name', width: 150 },
    { name: 'holder', label: 'Assignee', align: 'center', width: 80 },
    { name: 'startDate', label: 'Start time', align: 'center', width: 80 }
  ]
  return (
    <MaterialTheme>
      <BaseGantt tasks={tasks} columns={columns} />
    </MaterialTheme>
  )
}
