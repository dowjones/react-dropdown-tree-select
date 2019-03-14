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
      disabled: false,
      readOnly: false,
      hierarchical: false
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
    const { clearSearchOnChange, keepTreeOnSearch, simpleSelect, showPartiallySelected, disabled, readOnly, hierarchical } = this.state

    const tree1 = [
      { label: 'A', value: '1', children: [] },
      { label: 'B', value: '2', children: [] },
      { label: 'C', value: '3', children: [] }
    ]

    const tree2 = [
      { label: 'D', value: '4', children: [], className: '33' },
      { label: 'E', value: '5', children: [] },
      { label: 'F', value: '6', children: [] }
    ]

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
          <Checkbox label="Disabled" value="disabled" checked={disabled} onChange={this.onOptionsChange} />
          <Checkbox label="Read Only" value="readOnly" checked={readOnly} onChange={this.onOptionsChange} />
          <Checkbox label="Hierarchical" value="hierarchical" checked={hierarchical} onChange={this.onOptionsChange} />
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
            readOnly={readOnly}
            hierarchical={hierarchical}
          />
        </div>

        <div style={{ display: 'flex' }}>
          <DropdownTreeSelect data={tree1} showDropdown />
          <DropdownTreeSelect data={tree2} showDropdown />
        </div>
      </div>
    )
  }
}
export default WithOptions
