import test from 'ava'
import React from 'react'
import { mount } from 'enzyme'
import DropdownTreeSelect from './index'
import { mountToDoc, run } from './utils/a11yHelper'

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
          children: [{ label: 'item1-1-1', value: 'value1-1-1' }, { label: 'item1-1-2', value: 'value1-1-2' }]
        },
        { label: 'item1-2', value: 'value1-2' }
      ]
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
              children: [{ label: 'item2-1-3-1', value: 'value2-1-3-1' }]
            }
          ]
        },
        { label: 'item2-2', value: 'value2-2' }
      ]
    }
  ]
})

test('has no a11y violations', async t => {
  const { tree } = t.context
  const component = mountToDoc(<DropdownTreeSelect data={tree} showDropDown />)
  const domNode = component.getDOMNode()
  const { error, violations } = await run(domNode)
  t.is(error, null)
  if (violations && violations.length) {
    console.log(JSON.stringify(violations, null, 4))
  }
  t.is(violations.length, 0)
})
