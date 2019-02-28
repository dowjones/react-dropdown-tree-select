import React from 'react'

import DropdownTreeSelect from '../../../../src'
import '../../../../dist/styles.css'

import './index.css'
import data from './data.json'

const onChange = (curNode, selectedNodes) => {
  console.log('onChange::', curNode, selectedNodes)
}
const onAction = ({ action, node }) => {
  console.log(`onAction:: [${action}]`, node)
}
const onNodeToggle = curNode => {
  console.log('onNodeToggle::', curNode)
}

const Simple = () => (
  <div>
    <h1>Component with Default Values</h1>
    <p>
      Default Values get applied when there is no other user based selection. User can select more values and unselect default values as long as there
      is at least one user-selected value still present.
    </p>
    <DropdownTreeSelect data={data} onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle} />
  </div>
)

export default Simple
