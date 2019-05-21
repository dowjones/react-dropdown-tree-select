import test from 'ava'
import React from 'react'
import DropdownTreeSelect from '../index'
import { mountToDoc, run } from './a11y.utils'

test.beforeEach(t => {
  t.context.tree = [
    {
      label: 'item1',
      value: 'value1',
      expanded: true,
      checked: true,
      children: [
        {
          label: 'item1-1',
          value: 'value1-1',
          expanded: true,
          children: [{ label: 'item1-1-1', value: 'value1-1-1' }, { label: 'item1-1-2', value: 'value1-1-2' }],
        },
        { label: 'item1-2', value: 'value1-2' },
      ],
    },
    {
      label: 'item2',
      value: 'value2',
      checked: true,
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
              children: [{ label: 'item2-1-3-1', value: 'value2-1-3-1' }],
            },
          ],
        },
        { label: 'item2-2', value: 'value2-2' },
      ],
    },
  ]
})

test('has no a11y exceptions', async t => {
  const { tree } = t.context
  const component = mountToDoc(
    <div>
      <DropdownTreeSelect data={tree} showDropdown="initial" texts={{ label: 'test' }} />
      <DropdownTreeSelect data={tree} showDropdown="initial" disabled texts={{ label: 'test' }} />
      <DropdownTreeSelect data={tree} showDropdown="initial" readOnly texts={{ label: 'test' }} />
      <DropdownTreeSelect data={tree} showDropdown="initial" mode="simpleSelect" texts={{ label: 'test' }} />
      <DropdownTreeSelect data={tree} showDropdown="initial" mode="radioSelect" texts={{ label: 'test' }} />
      <DropdownTreeSelect data={tree} showDropdown="initial" mode="hierarchical" texts={{ label: 'test' }} />
    </div>
  )
  const domNode = component.getDOMNode()
  const { error, violations } = await run(domNode)
  t.is(error, null, JSON.stringify(error, null, 2))
  t.is(violations.length, 0, JSON.stringify(violations, null, 2))
})
