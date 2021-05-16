import React, { Component } from 'react';
import XLSX from 'xlsx'




function parse_xlsx(reader){
  var workbook = XLSX.read(new Uint8Array(reader.result), {type: 'array'});
  var first_sheet = workbook.SheetNames[0];
  var ws = workbook.Sheets[first_sheet]
  var range = ws['!ref']
  var end = range.split(':')[1]
  var new_range = 'A5:' + end
  var json = XLSX.utils.sheet_to_json(ws, {range:  new_range})
  return json
}


function json_to_task(json){
  console.log(json)
  var tasks = json.map(obj => {
    obj.text = obj['Task Name'];
    obj.start_date = obj['Start Date']
    obj.end_date = '01-01-2022'
    obj.holder = obj['Assigned To']
    obj.bucket = obj["Bucket Name"]
    obj.duration = 1;
    return obj
  })
  return {data: tasks}
}


function overwrite(e){
  e.preventDefault();
  e.stopPropagation();
}

class DragAndDrop extends Component {
  constructor(props){
    super(props);
    this.handleDrop = this.handleDrop.bind(this)
  }

  handleDragEnter(e){
    overwrite(e);
  }

  handleDragLeave(e){
    overwrite(e);
  }

  handleDragOver(e){
    overwrite(e);
  }


  handleDrop(e){
    overwrite(e);
    console.log('Drop Event!')
    var files = e.dataTransfer.files, f = files[0];
    var reader = new FileReader();
    reader.onload = () => {
      let json = parse_xlsx(reader);
      let tasks = json_to_task(json);
      this.props.setTasks(tasks)

    };
    reader.readAsArrayBuffer(f)
  }

  render(){
    return (
      <div className={this.props.tasks? 'hidden' : 'drag-drop-zone'}
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
export default DragAndDrop;
