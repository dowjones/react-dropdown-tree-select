import test from 'ava'
import React from 'react'
import { mount } from 'enzyme'
import { spy } from 'sinon'
import DropdownTreeSelect from './index'

test('ignores an option after becoming disabled while open', t => {
  const onChange = spy()
  const data = [{ label: 'Apple', value: 'apple', checked: true }, { label: 'Orange', value: 'orange' }]
  const host = document.body.appendChild(document.createElement('div'))
  const wrapper = mount(<DropdownTreeSelect data={data} mode="simpleSelect" onChange={onChange} />, { attachTo: host })
  wrapper.find('.dropdown-trigger').simulate('click')
  wrapper.setProps({ disabled: true })
  wrapper
    .find('.node-label')
    .at(1)
    .getDOMNode()
    .click()
  wrapper.update()

  t.false(onChange.called)
  t.true(
    wrapper
      .find('.tag')
      .text()
      .includes('Apple')
  )
  wrapper.unmount()
  host.remove()
})
