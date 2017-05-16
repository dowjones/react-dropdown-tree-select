import React from 'react'
import ReactDOM from 'react-dom'
import DropdownTreeSelect from '../src'
import data from './demo-data.json'

const onChange = (nodes) => { console.log('onChange::', nodes) }
const onAction = ({action, node}) => { console.log(`onAction:: [${action}]`, node) }

ReactDOM.render(<DropdownTreeSelect data={data} onChange={onChange} onAction={onAction} />, document.getElementById('app'))
