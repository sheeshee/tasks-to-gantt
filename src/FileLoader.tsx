import React, { useState, FC } from 'react'
import XLSX from 'xlsx'

import { Task } from './types/Task'

interface Props {
  setTasks: any
}

export const DragAndDrop: FC<Props> = ({ setTasks }) => {
  const [fileDraggedOver, setFileDraggedOver] = useState(false)

  const parseXLSX = (excelBinary: ArrayBuffer): unknown[] => {
    const workbook = XLSX.read(new Uint8Array(excelBinary), { type: 'array' })
    const firstSheet = workbook.SheetNames[0]
    const ws = workbook.Sheets[firstSheet]
    const range = ws['!ref']
    if (range !== undefined) {
      const end = range.split(':')[1]
      const newRange = 'A5:' + end

      // TODO test this
      const json = XLSX.utils.sheet_to_json<Task>(ws, {
        range: newRange,
        dateNF: 'yyyy-mm-dd'
      })
      return json
    }
    return []
  }

  const jsonToTask = (json: unknown[]): Task[] => {
    const tasks = json.map((obj) => ({
      ...obj,
      text: obj['Task Name'],
      start_date:
        obj['Start Date'] !== undefined ? obj['Start Date'] : '01-01-2022',
      end_date: '01-01-2022',
      holder: obj['Assigned To'],
      bucket: obj['Bucket Name'],
      duration: 1
    }))
    return { data: tasks }
  }

  const overwrite = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDragEnter: React.DragEventHandler<HTMLDivElement> = (event) => {
    overwrite(event)
  }

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = (event) => {
    overwrite(event)
    setFileDraggedOver(false)
  }

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
    overwrite(event)
    setFileDraggedOver(true)
  }

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    overwrite(event)
    const files = event.dataTransfer.files
    const f = files[0]
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result === null) throw new Error('Could not read file')
      // cannot be a string as we have read as array buffer
      const json = parseXLSX(reader.result as ArrayBuffer)
      const tasks = jsonToTask(json)
      setTasks(tasks)
    }
    reader.readAsArrayBuffer(f)
    setFileDraggedOver(false)
  }

  const getClassName = (): string =>
    'drag-drop-zone' + (fileDraggedOver ? ' drag-drop-zone--dashed' : '')

  return (
    <div
      className={getClassName()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}>
      <p>Drag files here to upload</p>
    </div>
  )
}
