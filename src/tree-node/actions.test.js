import { shallow } from 'enzyme'
import React from 'react'
import test from 'ava'
import toJson from 'enzyme-to-json'

import Actions from './actions'

test('renders actions', t => {
  const actions = [
    {
      title: 'action',
      className: 'cn0-0-0',
      text: 'hello',
      junk: '1'
    }
  ]

  const wrapper = toJson(shallow(<Actions actions={actions} />))

  t.snapshot(wrapper)
})

test('returns null if actions are empty', t => {
  t.snapshot(toJson(shallow(<Actions actions={undefined} />)))
  t.snapshot(toJson(shallow(<Actions actions={[]} />)))
})
