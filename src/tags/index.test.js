import { shallow } from 'enzyme'
import React from 'react'
import test from 'ava'
import toJson from 'enzyme-to-json'

import Tags from './index'
import Input from '../input'

test('renders tags', t => {
  const tags = [{ _id: 'i1', label: 'l1' }, { _id: 'i2', label: 'l2' }]
  const wrapper = toJson(
    shallow(
      <Tags tags={tags}>
        <Input />
      </Tags>
    )
  )
  t.snapshot(wrapper)
})

test('renders tags when no tags are passed', t => {
  const wrapper = toJson(
    shallow(
      <Tags>
        <Input />
      </Tags>
    )
  )
  t.snapshot(wrapper)
})

test('renders tags when no tags are passed nor Input', t => {
  const wrapper = toJson(shallow(<Tags />))
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

  const wrapper = toJson(
    shallow(
      <Tags tags={tags}>
        <Input />
      </Tags>
    )
  )

  t.snapshot(wrapper)
})
