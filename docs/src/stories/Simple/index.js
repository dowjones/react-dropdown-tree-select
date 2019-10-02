import React from 'react'

import DropdownTreeSelect from '../../../../src'

import data from './data.json'

const onChange = (curNode, selectedNodes) => {}
const onAction = (node, action) => {}
const onNodeToggle = curNode => {}
const onNodeNavigate = data => {}
const onFocus = () => {}
const onBlur = () => {}
const onNodeHover = (e, data) => {}
const onInputChange = e => {
  console.log(e)
}

const Simple = () => (
  <div>
    <DropdownTreeSelect
      onNodeHover={onNodeHover}
      showDropdown="always"
      keepTreeOnSearch={true}
      data={data}
      onChange={onChange}
      onAction={onAction}
      onNodeToggle={onNodeToggle}
      onFocus={onFocus}
      onBlur={onBlur}
      className="demo"
      mode="hierarchical"
      prependElement={<div>Test</div>}
      highlightSearch={true}
      onNodeNavigate={onNodeNavigate}
      enforceSingleSelection={true}
      onInputChange={onInputChange}
      value="Professor"
    />
  </div>
)

export default Simple
