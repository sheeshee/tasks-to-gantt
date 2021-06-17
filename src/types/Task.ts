export interface Task {
  id: number
  'Task ID': string
  text: string
  // required spelling for dhtmlx
  // eslint-disable-next-line camelcase
  start_date: string
  duration: number
  progress: number
}
