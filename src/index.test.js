import test from 'ava'
import React from 'react'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import DropdownTreeSelect from './index'

let tree

test.beforeEach(() => {
  tree = [
    {
      label: 'item1',
      value: 'value1',
      children: [
        {
          label: 'item1-1',
          value: 'value1-1',
          children: [{ label: 'item1-1-1', value: 'value1-1-1' }, { label: 'item1-1-2', value: 'value1-1-2' }]
        },
        { label: 'item1-2', value: 'value1-2' }
      ]
    },
    {
      label: 'item2',
      value: 'value2',
      children: [
        {
          label: 'item2-1',
          value: 'value2-1',
          children: [
            { label: 'item2-1-1', value: 'value2-1-1' },
            { label: 'item2-1-2', value: 'value2-1-2' },
            {
              label: 'item2-1-3',
              value: 'value2-1-3',
              children: [{ label: 'item2-1-3-1', value: 'value2-1-3-1' }]
            }
          ]
        },
        { label: 'item2-2', value: 'value2-2' }
      ]
    }
  ]
})

test('renders default state', t => {
  const wrapper = shallow(<DropdownTreeSelect data={tree} />)
  t.snapshot(toJson(wrapper))
})

test('shows dropdown', t => {
  const wrapper = shallow(<DropdownTreeSelect data={tree} showDropdown />)
  t.snapshot(toJson(wrapper))
})
