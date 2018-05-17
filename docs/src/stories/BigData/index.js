import React from 'react'

import DropdownTreeSelect from '../../../../src'

import './index.css'
import bigData from './big-data.json'

const onChange = (curNode, selectedNodes) => {
  console.log('onChange::', curNode, selectedNodes)
}
const onAction = ({ action, node }) => {
  console.log(`onAction:: [${action}]`, node)
}
const onNodeToggle = curNode => {
  console.log('onNodeToggle::', curNode)
}

const BigData = () => (
  <div>
    <h1>Tree with large amount of nodes</h1>
    <p>Performance testing with large amount of nodes (15k+). Searching and rendering should be smooth.</p>
    <DropdownTreeSelect data={bigData} onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle} />
  </div>
)

export default BigData
