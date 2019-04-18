import { shallow } from 'enzyme'
import React from 'react'
import test from 'ava'
import toJson from 'enzyme-to-json'

import RadioButton, { refUpdater } from './index'

test('Radio component', t => {
  const input = toJson(shallow(<RadioButton className="sample" name="sample" />))
  t.snapshot(input)
})

test('renders checked state', t => {
  const input = {}
  refUpdater({ checked: true })(input)
  t.true(input.checked)
})

test('renders disabled state', t => {
  const input = toJson(shallow(<RadioButton name="sample" disabled />))
  t.snapshot(input)
})
