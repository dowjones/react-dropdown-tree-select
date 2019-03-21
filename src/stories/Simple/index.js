import React from 'react'

import DropdownTreeSelect from '../../../../src'

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

const onFocus = () => {
  console.log('onFocus')
}

const onBlur = () => {
  console.log('onBlur')
}


const Simple = () => (
  <div>
    <h1>Basic component</h1>
    <p>
      This is a basic example of the component. Note that there are no external styles in this page, not even <code>reset.css</code> or{' '}
      <code>reboot.css</code> or <code>normalizer.css</code>.
    </p>
    <p>
      The idea is to showcase the component at its barest minimum. Of course, its easy to style it, using popular frameworks such as Bootstrap or
      Material Design (checkout the examples on left).
    </p>
    <p>
      As a side effect, it also helps rule out issues arising out of using custom frameworks (if something doesn&apos;t look right in your app but
      looks OK here, you know what is messing things up).
    </p>
    <DropdownTreeSelect data={data} onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle} onFocus={onFocus} onBlur={onBlur} className="demo" />
  </div>
)

export default Simple
