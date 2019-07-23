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
      keepOpenOnSelect: false,
      mode: 'multiSelect',
      showPartiallySelected: false,
      disabled: false,
      readOnly: false,
      hierarchical: false,
    }
  }

  onChange = (curNode, selectedNodes) => {
    console.log('onChange::', curNode, selectedNodes)
  }
  onAction = (node, action) => {
    console.log('onAction::', action, node)
  }
  onNodeToggle = curNode => {
    console.log('onNodeToggle::', curNode)
  }

  onOptionsChange = value => {
    this.setState({ [value]: !this.state[value] })
  }

  render() {
    const {
      clearSearchOnChange,
      keepTreeOnSearch,
      keepOpenOnSelect,
      mode,
      showPartiallySelected,
      disabled,
      readOnly,
      showDropdown,
    } = this.state

    return (
      <div>
        <h1>Options playground</h1>
        <p>Toggle different options to see its effect on the dropdown.</p>
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginBottom: '20px',
            padding: 10,
          }}
        >
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor={mode}>Mode: </label>
            <select id="mode" value={mode} onChange={e => this.setState({ mode: e.target.value })}>
              <option value="multiSelect">Multi select</option>
              <option value="simpleSelect">Simple select</option>
              <option value="radioSelect">Radio select</option>
              <option value="hierarchical">Hierarchical</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor={showDropdown}>Show dropdown: </label>
            <select
              id="showDropdown"
              value={showDropdown}
              onChange={e => this.setState({ showDropdown: e.target.value })}
            >
              <option value="default">--</option>
              <option value="initial">Initial</option>
              <option value="always">Always</option>
            </select>
          </div>
          <Checkbox
            label="Clear search on selection"
            value="clearSearchOnChange"
            checked={clearSearchOnChange}
            onChange={this.onOptionsChange}
          />
          <Checkbox
            label="Keep tree on search"
            value="keepTreeOnSearch"
            checked={keepTreeOnSearch}
            onChange={this.onOptionsChange}
          />
          <Checkbox
            label="Keep tree open on select"
            value="keepOpenOnSelect"
            checked={keepOpenOnSelect}
            onChange={this.onOptionsChange}
          />
          <Checkbox
            label="Show Partially Selected"
            value="showPartiallySelected"
            checked={showPartiallySelected}
            onChange={this.onOptionsChange}
          />
          <Checkbox label="Disabled" value="disabled" checked={disabled} onChange={this.onOptionsChange} />
          <Checkbox label="Read Only" value="readOnly" checked={readOnly} onChange={this.onOptionsChange} />
        </div>
        <div>
          <DropdownTreeSelect
            id="rdts"
            data={data}
            onChange={this.onChange}
            onAction={this.onAction}
            onNodeToggle={this.onNodeToggle}
            clearSearchOnChange={clearSearchOnChange}
            keepTreeOnSearch={keepTreeOnSearch}
            keepOpenOnSelect={keepOpenOnSelect}
            mode={mode}
            showPartiallySelected={showPartiallySelected}
            disabled={disabled}
            readOnly={readOnly}
            showDropdown={showDropdown}
            texts={{ label: 'Demo Dropdown' }}
          />
        </div>
      </div>
    )
  }
}
export default WithOptions
