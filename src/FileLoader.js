import React, { Component } from 'react'
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

class DragAndDrop extends Component {
  constructor (props) {
    super(props)
    this.handleDrop = this.handleDrop.bind(this)
    this.handleDragLeave = this.handleDragLeave.bind(this)
    this.handleDragOver = this.handleDragOver.bind(this)

    this.state = {
      fileDraggedOver: false
    }
  }

  handleDragEnter (e) {
    overwrite(e)
  }

  handleDragLeave (e) {
    overwrite(e)
    this.setState({ fileDraggedOver: false })
  }

  handleDragOver (e) {
    overwrite(e)
    this.setState({ fileDraggedOver: true })
  }

  handleDrop (e) {
    overwrite(e)
    const files = e.dataTransfer.files
    const f = files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const json = parseXLSX(reader)
      const tasks = jsonToTask(json)
      this.props.setTasks(tasks)
    }
    reader.readAsArrayBuffer(f)
    this.setState({ fileDraggedOver: false })
  }

  getClassName () {
    return this.props.tasks
      ? 'hidden'
      : 'drag-drop-zone' + (this.state.fileDraggedOver
        ? ' drag-drop-zone--dashed'
        : '')
  }

  render () {
    return (
      <div className={this.getClassName()}
        onDrop={this.handleDrop}
        onDragOver={this.handleDragOver}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
      >
        <p>Drag files here to upload</p>
      </div>
    )
  }
}

DragAndDrop.propTypes = {
  tasks: Task,
  setTasks: PropTypes.func
}

export default DragAndDrop
