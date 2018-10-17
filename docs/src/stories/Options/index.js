import React, { PureComponent } from 'react'

import Checkbox from './Checkbox'
import DropdownTreeSelect from '../../../../src'

import './index.css'
import data from './data.json'

class WithOptions extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      clearSearchOnChange: false,
      keepTreeOnSearch: false,
      simpleSelect: false,
      showPartiallySelected: false,
      disabled: false
    }
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

  render() {
    const { clearSearchOnChange, keepTreeOnSearch, simpleSelect, showPartiallySelected, disabled } = this.state

    return (
      <div>
        <h1>Options playground</h1>
        <p>Toggle different options to see its effect on the dropdown.</p>
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginBottom: '20px',
            padding: 10
          }}
        >
          <Checkbox label="Clear search on selection" value="clearSearchOnChange" checked={clearSearchOnChange} onChange={this.onOptionsChange} />
          <Checkbox label="Keep tree on search" value="keepTreeOnSearch" checked={keepTreeOnSearch} onChange={this.onOptionsChange} />
          <Checkbox label="Simple Select" value="simpleSelect" checked={simpleSelect} onChange={this.onOptionsChange} />
          <Checkbox label="Show Partially Selected" value="showPartiallySelected" checked={showPartiallySelected} onChange={this.onOptionsChange} />
          <Checkbox label="Disable Input" value="disabled" checked={disabled} onChange={this.onOptionsChange} />
        </div>
        <div>
          <DropdownTreeSelect
            data={data}
            onChange={this.onChange}
            onAction={this.onAction}
            onNodeToggle={this.onNodeToggle}
            clearSearchOnChange={clearSearchOnChange}
            keepTreeOnSearch={keepTreeOnSearch}
            simpleSelect={simpleSelect}
            showPartiallySelected={showPartiallySelected}
            disabled={disabled}
          />
        </div>
      </div>
    )
  }
}
export default WithOptions
