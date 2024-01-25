import React, { useState } from 'react'

import DropdownTreeSelect from '../../../../src'
import '../../../../dist/styles.css'

import './index.css'
import data from './data.json'

const onChange = (curNode, selectedNodes, all) => {
  console.log('onChange::', curNode, selectedNodes, all)
}
const onAction = (node, action) => {
  console.log('onAction::', action, node)
}
const onNodeToggle = curNode => {
  console.log('onNodeToggle::', curNode)
}

const ref = React.createRef()

const runChange = () => {
  const arr = Array.from(ref.current.state.tree.values())
  // ref.current.treeManager.setNodeCheckedState(arr[0]._id, true)

  // let tags = ref.current.treeManager.tags

  ref.current.onTagRemove(arr[0]._id)
}

const Simple = () => {
  // const [selected, setSelected] = useState(['iway'])

  // setTimeout(() => {
  //   setSelected(['marmara-university'])
  //   console.log('SHOULD UPDATE', selected)
  // }, 5000)

  // console.log(ref.treeManager.setNodeCheckedState(, checked))

  // if (ref.current) {
  //   const arr = Array.from(ref.current.state.tree.values())
  //   ref.current.treeManager.setNodeCheckedState(arr[0]._id, true)
  // }
  setTimeout(runChange, 5000)

  return (
    <div>
      <h1>Component with Default Values</h1>
      <p>
        Default Values get applied when there is no other user based selection. User can select more values and unselect
        default values as long as there is at least one user-selected value still present.
      </p>
      <DropdownTreeSelect ref={ref} data={data} onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle} />
    </div>
  )
}

export default Simple
