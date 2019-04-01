import test from 'ava'
import React from 'react'
import { mount } from 'enzyme'
import DropdownTreeSelect from './index'

const node = (id, label) =>
  ({ id, label, value: label })

const tree = {
  ...node('c1', 'ccc 1'),
  children: [
    {
      ...node('c2', 'ccc 2'),
      children: [node('a1', 'aaa 1'), node('a2', 'aaa 2')]
    },
    {
      ...node('c3', 'ccc 3'),
      children: [node('a3', 'aaa 3'), node('b1', 'bbb 1'), node('b2', 'bbb 2')]
    }
  ]
}

test('some key presses opens dropdown on keyboardNavigation', t => {
  ['ArrowUp', 'ArrowDown', 'Home', 'PageUp', 'End', 'PageDown', 'a', 'B'].forEach(key => {
    const wrapper = mount(<DropdownTreeSelect data={tree} enableKeyboardNavigation />)
    wrapper.find('.search').simulate('keyDown', { key })
    t.true(wrapper.state().showDropdown)
  })
})

test('esc closes dropdown on keyboardNavigation', t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} enableKeyboardNavigation />);
  ['ArrowDown', 'Escape'].forEach(key => {
    wrapper.find('.search').simulate('keyDown', { key })
  })
  t.false(wrapper.state().showDropdown)
})

test('other key presses does not open dropdown on keyboardNavigation', t => {
  ['Enter', 'ArrowLeft', 'ArrowRight'].forEach(key => {
    const wrapper = mount(<DropdownTreeSelect data={tree} enableKeyboardNavigation />)
    wrapper.find('.search').simulate('keyDown', { key })
    t.true(wrapper.state().showDropdown)
  })
})

test('can navigate and focus child on keyboardNavigation', t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} enableKeyboardNavigation />);
  ['ArrowDown', 'ArrowRight', 'ArrowRight', 'ArrowDown', 'ArrowRight', 'ArrowRight', 'ArrowDown'].forEach(key => {
    wrapper.find('.search').simulate('keyDown', { key })
  })
  t.deepEqual(wrapper.find('li.focused').text(), 'bbb 1')
})

test('can navigate circular on keyboardNavigation', t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} enableKeyboardNavigation />);
  ['ArrowDown', 'ArrowRight', 'ArrowRight', 'ArrowDown', 'ArrowDown'].forEach(key => {
    wrapper.find('.search').simulate('keyDown', { key })
  })
  t.deepEqual(wrapper.find('li.focused').text(), 'ccc 1')
  wrapper.find('.search').simulate('keyDown', { key: 'ArrowUp' })
  t.deepEqual(wrapper.find('li.focused').text(), 'ccc 3')
})

test('can navigate to edge on keyboardNavigation', t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} enableKeyboardNavigation />);
  ['ArrowDown', 'ArrowRight', 'ArrowRight'].forEach(key => {
    wrapper.find('.search').simulate('keyDown', { key })
  });

  ['PageDown', 'PageUp', 'End', 'Home'].forEach((key, index) => {
    const expected = index % 2 === 0 ? 'ccc 3' : 'ccc 1'
    wrapper.find('.search').simulate('keyDown', { key })
    t.deepEqual(wrapper.find('li.focused').text(), expected)
  })
})

test('can collapse on keyboardNavigation', t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} enableKeyboardNavigation />);
  ['ArrowDown', 'ArrowRight', 'ArrowRight', 'ArrowDown'].forEach(key => {
    wrapper.find('.search').simulate('keyDown', { key })
  })
  t.deepEqual(wrapper.find('li.focused').text(), 'ccc 3')

  wrapper.find('.search').simulate('keyDown', { key: 'ArrowLeft' })
  t.deepEqual(wrapper.find('li.focused').text(), 'ccc 1')
  t.true(wrapper.find('#c3').exists())

  wrapper.find('.search').simulate('keyDown', { key: 'ArrowLeft' })
  t.false(wrapper.find('#c3').exists())
})

test('can navigate searchresult on keyboardNavigation', t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} enableKeyboardNavigation showDropdown />)
  wrapper.instance().onInputChange('bb');
  ['b', 'ArrowDown', 'ArrowDown', 'ArrowDown'].forEach(key => {
    wrapper.find('.search').simulate('keyDown', { key })
  })
  t.deepEqual(wrapper.find('li.focused').text(), 'bbb 1')
})

