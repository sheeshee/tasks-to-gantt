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
  console.log(json)
  const tasks = json.map(obj => {
    obj.text = obj['Task Name']
    obj.start_date = obj['Start Date']
    obj.end_date = '01-01-2022'
    obj.holder = obj['Assigned To']
    obj.bucket = obj['Bucket Name']
    obj.duration = 1
    return obj
  })
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
  }

  handleDragEnter (e) {
    overwrite(e)
  }

  handleDragLeave (e) {
    overwrite(e)
  }

  handleDragOver (e) {
    overwrite(e)
  }

  handleDrop (e) {
    overwrite(e)
    console.log('Drop Event!')
    const files = e.dataTransfer.files; const f = files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const json = parseXLSX(reader)
      const tasks = jsonToTask(json)
      this.props.setTasks(tasks)
    }
    reader.readAsArrayBuffer(f)
  }

  render () {
    return (
      <div className={this.props.tasks ? 'hidden' : 'drag-drop-zone'}
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
