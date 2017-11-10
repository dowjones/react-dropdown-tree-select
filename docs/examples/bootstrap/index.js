import React from 'react'
import ReactDOM from 'react-dom'
import DropdownTreeSelect from '../../../src'
import data from './demo-data.json'

const onChange = (curNode, selectedNodes) => { console.log('onChange::', curNode, selectedNodes) }
const onAction = ({action, node}) => { console.log(`onAction:: [${action}]`, node) }
const onNodeToggle = (curNode) => { console.log('onNodeToggle::', curNode) }

ReactDOM.render(
<DropdownTreeSelect 
    data={data} 
    onChange={onChange} 
    onAction={onAction} 
    onNodeToggle={onNodeToggle} 
    className="bootstrap-demo"
/>, document.getElementById('app'))
