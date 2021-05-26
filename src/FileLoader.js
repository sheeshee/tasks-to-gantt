import React, { useState } from 'react'
import PropTypes from 'prop-types'
import XLSX from 'xlsx'

import { Task } from './types/Task'

function parseXLSX (reader) {
  const workbook = XLSX.read(new Uint8Array(reader.result), { type: 'array' })
  const firstSheet = workbook.SheetNames[0]
  const ws = workbook.Sheets[firstSheet]
  const range = ws['!ref']
  const end = range.split(':')[1]
  const newRange = 'A5:' + end
  const json = XLSX.utils.sheet_to_json(ws, { range: newRange })
  return json
}

function jsonToTask (json) {
  const tasks = json.map(obj => ({
    ...obj,
    text: obj['Task Name'],
    start_date: obj['Start Date'],
    end_date: '01-01-2022',
    holder: obj['Assigned To'],
    bucket: obj['Bucket Name'],
    duration: 1
  }))
  return { data: tasks }
}

function overwrite (e) {
  e.preventDefault()
  e.stopPropagation()
}

export function DragAndDrop (props) {
  const [fileDraggedOver, setFileDraggedOver] = useState(false)
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
      props.setTasks(tasks)
    }
    reader.readAsArrayBuffer(f)
    setFileDraggedOver(false)
  }
  const getClassName = () => {
    return props.tasks
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
