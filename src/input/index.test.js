import { shallow } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'

import Input from './index'

describe('<Input/>', () => {
  it('renders tags', () => {
    const tags = [{_id: 'i1', label: 'l1'}, {_id: 'i2', label: 'l2'}]
    const tree = renderer
      .create(<Input tags={tags} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders input when no tags are passed', () => {
    const tree = renderer
      .create(<Input />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders placeholder', () => {
    const placeholderText = 'select something'
    const tree = renderer
      .create(<Input placeholderText={placeholderText} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('raises onchange', () => {
    const onChange = jest.fn()
    const wrapper = shallow(<Input onInputChange={onChange} />)
    wrapper.find('input').simulate('change', {target: {value: 'hello'}, persist: jest.fn()})
    expect(onChange).toBeCalledWith('hello')
  })
})
