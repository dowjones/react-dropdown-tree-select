import React, { PureComponent } from 'react'

import Checkbox from './Checkbox'
import DropdownTreeSelect from '../../../../src'

import './index.css'
import data from './data.json'

class WithOptions extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      searchTerm: '',
      clearSearchOnChange: false,
      keepTreeOnSearch: false,
      keepOpenOnSelect: false,
      mode: 'multiSelect',
      pageSize: undefined,
      inlineSearchInput: false,
      showPartiallySelected: false,
      disabled: false,
      readOnly: false,
      hierarchical: false,
      placeholder: 'Choose...',
      inlineSearchPlaceholder: 'Search...',
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

  onSearchChange = searchTerm => {
    this.setState({ searchTerm: searchTerm })
  }

  render() {
    const {
      searchTerm,
      clearSearchOnChange,
      keepTreeOnSearch,
      keepOpenOnSelect,
      mode,
      pageSize,
      showPartiallySelected,
      disabled,
      readOnly,
      showDropdown,
      inlineSearchInput,
      placeholder,
      inlineSearchPlaceholder,
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
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="placeholder">Placeholder text: </label>
            <input
              id="placeholder"
              type="text"
              value={placeholder}
              onChange={e => this.setState({ placeholder: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="inlinePlaceholderText">Inline placeholder text: </label>
            <input
              id="inlineSearchPlaceholder"
              type="text"
              value={inlineSearchPlaceholder}
              onChange={e => this.setState({ inlineSearchPlaceholder: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="searchTerm">Search term: </label>
            <input
              id="searchTerm"
              type="text"
              value={searchTerm}
              onChange={e => this.setState({ searchTerm: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="pageSize">Page size ({pageSize || 100}): </label>
            <input
              id="pageSize"
              type="range"
              min={50}
              max={1000}
              value={pageSize || 100}
              onChange={e => this.setState({ pageSize: e.target.valueAsNumber || undefined })}
            />
          </div>
          <Checkbox
            label="Inline Search Input"
            value="inlineSearchInput"
            checked={inlineSearchInput}
            onChange={this.onOptionsChange}
          />
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
            searchTerm={searchTerm}
            onChange={this.onChange}
            onAction={this.onAction}
            onNodeToggle={this.onNodeToggle}
            onSearchChange={this.onSearchChange}
            clearSearchOnChange={clearSearchOnChange}
            keepTreeOnSearch={keepTreeOnSearch}
            keepOpenOnSelect={keepOpenOnSelect}
            mode={mode}
            pageSize={pageSize}
            showPartiallySelected={showPartiallySelected}
            disabled={disabled}
            readOnly={readOnly}
            inlineSearchInput={inlineSearchInput}
            showDropdown={showDropdown}
            texts={{ label: 'Demo Dropdown', placeholder, inlineSearchPlaceholder }}
          />
        </div>
      </div>
    )
  }
}
export default WithOptions
