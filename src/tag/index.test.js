import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'

import Tag from './index'

const nativeEvent = { nativeEvent: { stopImmediatePropagation: () => {} } }

describe('<Tag/>', () => {
  it('renders label when passed in', () => {
    const tree = renderer
      .create(<Tag label='hello' id='abc' />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('call onDelete handler when pill is closed', () => {
    const onDelete = jest.fn()
    const wrapper = mount(<Tag label='hello' id='abc' onDelete={onDelete} />)
    wrapper.find('.tag-remove').simulate('click', nativeEvent)
    expect(onDelete).toBeCalledWith('abc')
  })

  it('should not cause form submit', () => {
    const onSubmit = jest.fn()
    const onDelete = jest.fn()
    const wrapper = mount(
      <form onSubmit={onSubmit}>
        <Tag label='hello' id='abc' onDelete={onDelete} />
      </form>
    )
    wrapper.find('.tag-remove').simulate('click', nativeEvent)
    expect(onSubmit).not.toBeCalled()
  })
})
