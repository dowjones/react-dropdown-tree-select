import test from 'ava'
import React from 'react'
import { spy } from 'sinon'
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

/** Try with no simulate:
 * const dummy = () => {}
 * const onKeyDown = wrapper.instance().onKeyboardKeyDown
 *
 * onKeyDown({
 *  key,
 *  persist: dummy,
 * preventDefault: dummy
 * }) */
const triggerOnKeyboardKeyDown = (wrapper, keys) => {
  const elements = [].concat(keys || [])
  elements.forEach(key =>
    wrapper.find('.search').simulate('keyDown', { key }))
}

test('some key presses opens dropdown on keyboardNavigation', t => {
  ['ArrowUp', 'ArrowDown', 'Home', 'PageUp', 'End', 'PageDown', 'a', 'B'].forEach(key => {
    const wrapper = mount(<DropdownTreeSelect data={tree} />)
    triggerOnKeyboardKeyDown(wrapper, key)
    t.true(wrapper.state().showDropdown)
  })
})

test('esc closes dropdown on keyboardNavigation', async t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} />)
  triggerOnKeyboardKeyDown(wrapper, ['ArrowDown', 'Escape'])
  const showDropdown = await new Promise(resolve =>
    setTimeout(() => { resolve(wrapper.state().showDropdown) }, 1))
  t.false(showDropdown)
})

test('other key presses does not open dropdown on keyboardNavigation', t => {
  ['Enter', 'ArrowLeft', 'ArrowRight'].forEach(key => {
    const wrapper = mount(<DropdownTreeSelect data={tree} />)
    triggerOnKeyboardKeyDown(wrapper, key)
    t.false(wrapper.state().showDropdown)
  })
})

test('can navigate and focus child on keyboardNavigation', t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} />)
  triggerOnKeyboardKeyDown(wrapper, ['ArrowDown', 'ArrowRight', 'ArrowRight', 'ArrowDown', 'ArrowRight', 'ArrowRight', 'ArrowDown'])
  t.deepEqual(wrapper.find('li.focused').text(), 'bbb 1')
})

test('can navigate circular on keyboardNavigation', t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} />)
  triggerOnKeyboardKeyDown(wrapper, ['ArrowDown', 'ArrowRight', 'ArrowRight', 'ArrowDown', 'ArrowDown'])
  t.deepEqual(wrapper.find('li.focused').text(), 'ccc 1')
  triggerOnKeyboardKeyDown(wrapper, 'ArrowUp')
  t.deepEqual(wrapper.find('li.focused').text(), 'ccc 3')
})

test('can navigate to edge on keyboardNavigation', t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} />)
  triggerOnKeyboardKeyDown(wrapper, ['ArrowDown', 'ArrowRight', 'ArrowRight', 'ArrowRight']);

  ['PageDown', 'PageUp', 'End', 'Home'].forEach((key, index) => {
    const expected = index % 2 === 0 ? 'ccc 3' : 'ccc 1'
    triggerOnKeyboardKeyDown(wrapper, key)
    t.deepEqual(wrapper.find('li.focused').text(), expected)
  })
})

test('can collapse on keyboardNavigation', t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} />)
  triggerOnKeyboardKeyDown(wrapper, ['ArrowDown', 'ArrowRight', 'ArrowRight', 'ArrowDown'])
  t.deepEqual(wrapper.find('li.focused').text(), 'ccc 3')

  triggerOnKeyboardKeyDown(wrapper, 'ArrowLeft')
  t.deepEqual(wrapper.find('li.focused').text(), 'ccc 1')
  t.true(wrapper.find('#c3').exists())

  triggerOnKeyboardKeyDown(wrapper, 'ArrowLeft')
  t.false(wrapper.find('#c3').exists())
})

test('can navigate searchresult on keyboardNavigation', t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} showDropdown />)
  wrapper.instance().onInputChange('bb')
  triggerOnKeyboardKeyDown(wrapper, ['b', 'ArrowDown', 'ArrowDown', 'ArrowDown'])
  t.deepEqual(wrapper.find('li.focused').text(), 'bbb 1')
})

test('can navigate with keepTreOnSearch on keyboardNavigation', t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} keepTreeOnSearch />)
  wrapper.instance().onInputChange('bb')
  triggerOnKeyboardKeyDown(wrapper, ['b', 'ArrowDown', 'ArrowDown', 'ArrowDown'])
  t.deepEqual(wrapper.find('li.focused').text(), 'bbb 1')
  t.true(wrapper.find('#c1').exists())
})

test('can delete tags on empty search input with backspace on keyboardNavigation', t => {
  const data = [{ ...node('a', 'a'), checked: true }, { ...node('b', 'b'), checked: true }]
  const wrapper = mount(<DropdownTreeSelect data={data} />)
  wrapper.instance().searchInput.value = 'x'
  triggerOnKeyboardKeyDown(wrapper, 'Backspace')
  t.deepEqual(wrapper.state().tags.length, 2)

  wrapper.instance().searchInput.value = ''
  triggerOnKeyboardKeyDown(wrapper, 'Backspace')
  t.deepEqual(wrapper.state().tags.length, 1)
  triggerOnKeyboardKeyDown(wrapper, 'Backspace')
  t.deepEqual(wrapper.state().tags.length, 0)
})

test('can select with enter on keyboardNavigation', t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} />)
  triggerOnKeyboardKeyDown(wrapper, ['ArrowDown', 'ArrowDown', 'Enter'])
  t.deepEqual(wrapper.state().tags.length, 1)
})

test('can delete tags with backspace/delete on keyboardNavigation', t => {
  const data = [{ ...node('a', 'a'), checked: true }, { ...node('b', 'b'), checked: true }]
  const wrapper = mount(<DropdownTreeSelect data={data} />)
  const event = {
    type: 'keydown',
    stopPropagation: spy(),
    nativeEvent: { stopImmediatePropagation: spy() }
  }
  wrapper.find('#a_tag > .tag-remove').simulate('keyDown', { ...event, key: 'Backspace' })
  t.deepEqual(wrapper.state().tags.length, 1)
  wrapper.find('#b_tag > .tag-remove').simulate('keyUp', { ...event, key: 'Delete' })
  t.deepEqual(wrapper.state().tags.length, 0)
})
