import { shallow } from 'enzyme'
import React from 'react'
import test from 'ava'
import toJson from 'enzyme-to-json'

import Trigger from './index'

test('Trigger component', t => {
  const input = toJson(shallow(<Trigger clientId={'rtds'} />))
  t.snapshot(input)
})
