import React, { PureComponent } from 'react'

import Checkbox from './Checkbox'
import DropdownTreeSelect from '../../../../src'
import '../../../../dist/styles.css'

import './index.css'
import data from './data.json'

class WithOptions extends PureComponent {
  constructor (props) {
    super(props)

    this.state = { keepTreeOnSearch: false, simpleSelect: false, showPartiallySelected: false }
  }

  onChange = (curNode, selectedNodes) => {
    console.log('onChange::', curNode, selectedNodes)
  }
  onAction = ({ action, node }) => {
    console.log(`onAction:: [${action}]`, node)
  }
  onNodeToggle = curNode => {
    console.log('onNodeToggle::', curNode)
  }

  onOptionsChange = value => {
    this.setState({ [value]: !this.state[value] })
  }

  render () {
    const { keepTreeOnSearch, simpleSelect, showPartiallySelected } = this.state

    return (
      <div>
        <h1>Options playground</h1>
        <p>Toggle different options to see its effect on the dropdown.</p>
        <div style={{ border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px', padding: 10 }}>
          <Checkbox label="Keep tree on search" value="keepTreeOnSearch" checked={keepTreeOnSearch} onChange={this.onOptionsChange} />
          <Checkbox label="Simple Select" value="simpleSelect" checked={simpleSelect} onChange={this.onOptionsChange} />
          <Checkbox label="Show Partially Selected" value="showPartiallySelected" checked={showPartiallySelected} onChange={this.onOptionsChange} />
        </div>
        <div>
          <DropdownTreeSelect
            data={data}
            onChange={this.onChange}
            onAction={this.onAction}
            onNodeToggle={this.onNodeToggle}
            keepTreeOnSearch={keepTreeOnSearch}
            simpleSelect={simpleSelect}
            showPartiallySelected={showPartiallySelected}
          />
        </div>
      </div>
    )
  }
}
export default WithOptions
