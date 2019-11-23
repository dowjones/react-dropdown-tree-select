import { shallow } from 'enzyme'
import React from 'react'
import test from 'ava'
import toJson from 'enzyme-to-json'

import Tags from './index'

test('renders tags', t => {
  const tags = [{ _id: 'i1', label: 'l1' }, { _id: 'i2', label: 'l2' }]
  const wrapper = toJson(shallow(<Tags tags={tags} />))
  t.snapshot(wrapper)
})

test('should render data attributes', t => {
  const tags = [
    {
      _id: 'i1',
      label: 'l1',
      tagClassName: 'test',
      dataset: {
        first: 'john',
        last: 'smith',
      },
    },
  ]

  const wrapper = toJson(shallow(<Tags tags={tags} />))

  t.snapshot(wrapper)
})
