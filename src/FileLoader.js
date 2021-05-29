import React, { useState } from 'react'
import PropTypes from 'prop-types'
import XLSX from 'xlsx'

import { Task } from './types/Task'

export function DragAndDrop ({ setTasks, tasks }) {
  const [fileDraggedOver, setFileDraggedOver] = useState(false)

  const parseXLSX = (reader) => {
    const workbook = XLSX.read(new Uint8Array(reader.result), { type: 'array' })
    const firstSheet = workbook.SheetNames[0]
    const ws = workbook.Sheets[firstSheet]
    const range = ws['!ref']
    const end = range.split(':')[1]
    const newRange = 'A5:' + end
    const json = XLSX.utils.sheet_to_json(ws, { range: newRange, cellDate: false, dateNF: 'yyyy-mm-dd' })
    return json
  }

  const jsonToTask = (json) => {
    const tasks = json.map(obj => ({
      ...obj,
      text: obj['Task Name'],
      start_date: obj['Start Date'] ? obj['Start Date'] : '01-01-2022',
      end_date: '01-01-2022',
      holder: obj['Assigned To'],
      bucket: obj['Bucket Name'],
      duration: 1
    }))
    return { data: tasks }
  }

  const overwrite = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e) => { overwrite(e) }

  const handleDragLeave = (e) => {
    overwrite(e)
    setFileDraggedOver(false)
  }

  const handleDragOver = (e) => {
    overwrite(e)
    setFileDraggedOver(true)
  }

  const handleDrop = (e) => {
    overwrite(e)
    const files = e.dataTransfer.files
    const f = files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const json = parseXLSX(reader)
      const tasks = jsonToTask(json)
      setTasks(tasks)
    }
    reader.readAsArrayBuffer(f)
    setFileDraggedOver(false)
  }

  const getClassName = () => {
    return tasks
      ? 'hidden'
      : 'drag-drop-zone' + (fileDraggedOver
        ? ' drag-drop-zone--dashed'
        : '')
  }

  return (
    <div className={getClassName()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <p>Drag files here to upload</p>
    </div>
  )
}

DragAndDrop.propTypes = {
  tasks: Task,
  setTasks: PropTypes.func
}
