import test from 'ava'
import React from 'react'
import { spy, stub, assert } from 'sinon'
import { mount } from 'enzyme'
import DropdownTreeSelect from './index'

const node = (id, label) => ({ id, label, value: label })

const tree = {
  ...node('c1', 'ccc 1'),
  children: [
    {
      ...node('c2', 'ccc 2'),
      children: [node('a1', 'aaa 1'), node('a2', 'aaa 2')],
    },
    {
      ...node('c3', 'ccc 3'),
      children: [node('a3', 'aaa 3'), node('b1', 'bbb 1'), node('b2', 'bbb 2')],
    },
  ],
}

const triggerOnKeyboardKeyDown = (wrapper, keys) => {
  const elements = [].concat(keys || [])
  elements.forEach(key => wrapper.find('.search').simulate('keyDown', { key }))
}

test('some key presses opens dropdown on keyboardNavigation', t => {
  ;['ArrowUp', 'ArrowDown', 'Home', 'PageUp', 'End', 'PageDown', 'a', 'B'].forEach(key => {
    const wrapper = mount(<DropdownTreeSelect data={tree} />)
    triggerOnKeyboardKeyDown(wrapper, key)
    t.true(wrapper.state().showDropdown)
  })
})

test('esc closes dropdown on keyboardNavigation', async t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} />)
  triggerOnKeyboardKeyDown(wrapper, ['ArrowDown', 'Escape'])
  const showDropdown = await new Promise(resolve =>
    setTimeout(() => {
      resolve(wrapper.state().showDropdown)
    }, 1)
  )
  t.false(showDropdown)
})

test('other key presses does not open dropdown on keyboardNavigation', t => {
  ;['Enter', 'ArrowLeft', 'ArrowRight'].forEach(key => {
    const wrapper = mount(<DropdownTreeSelect data={tree} />)
    triggerOnKeyboardKeyDown(wrapper, key)
    t.false(wrapper.state().showDropdown)
  })
})

test('can navigate and focus child on keyboardNavigation', t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} />)
  triggerOnKeyboardKeyDown(wrapper, [
    'ArrowDown',
    'ArrowRight',
    'ArrowRight',
    'ArrowDown',
    'ArrowRight',
    'ArrowRight',
    'ArrowDown',
  ])
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
  triggerOnKeyboardKeyDown(wrapper, ['ArrowDown', 'ArrowRight', 'ArrowRight', 'ArrowRight'])
  ;['PageDown', 'PageUp', 'End', 'Home'].forEach((key, index) => {
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
  const wrapper = mount(<DropdownTreeSelect data={tree} showDropdown="initial" />)
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
    nativeEvent: { stopImmediatePropagation: spy() },
  }
  wrapper.find('#a_tag > .tag-remove').simulate('keyDown', { ...event, key: 'Backspace' })
  t.deepEqual(wrapper.state().tags.length, 1)
  wrapper.find('#b_tag > .tag-remove').simulate('keyUp', { ...event, key: 'Delete' })
  t.deepEqual(wrapper.state().tags.length, 0)
})

test('remembers current focus between prop updates', t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} showDropdown="initial" />)
  t.false(wrapper.find('li.focused').exists())
  triggerOnKeyboardKeyDown(wrapper, ['ArrowDown'])
  t.deepEqual(wrapper.find('li.focused').text(), 'ccc 1')
  wrapper.setProps({ data: tree })
  wrapper.instance().handleClick()
  t.deepEqual(wrapper.find('li.focused').text(), 'ccc 1')
})

test('should set current focus as selected on tab out for simpleSelect', t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} mode="simpleSelect" />)
  triggerOnKeyboardKeyDown(wrapper, ['ArrowDown', 'ArrowRight', 'ArrowRight', 'Tab'])
  t.deepEqual(wrapper.state().tags[0].label, 'ccc 1')
})

test('should scroll on keyboard navigation', t => {
  const largeTree = [...Array(150).keys()].map(i => node(`id${i}`, `label${i}`))
  const scrollIntoView = (Element.prototype.scrollIntoView = spy())
  const wrapper = mount(<DropdownTreeSelect data={largeTree} showDropdown="initial" />)
  const getElementById = stub(document, 'getElementById')
  const contentNode = wrapper.find('.dropdown-content').getDOMNode()

  t.deepEqual(contentNode.scrollTop, 0)

  triggerOnKeyboardKeyDown(wrapper, ['ArrowUp'])
  largeTree.forEach((n, index) => {
    getElementById.withArgs(`${n.id}_li`).returns({ offsetTop: index, clientHeight: 1, scrollIntoView })
  })

  triggerOnKeyboardKeyDown(wrapper, ['ArrowUp'])
  t.deepEqual(wrapper.find('li.focused').text(), 'label148')
  assert.calledOnce(scrollIntoView)

  getElementById.restore()
})

test('should only scroll on keyboard navigation', t => {
  const largeTree = [...Array(150).keys()].map(i => node(`id${i}`, `label${i}`))
  const getElementById = stub(document, 'getElementById')
  const scrollIntoView = (Element.prototype.scrollIntoView = spy())
  const wrapper = mount(<DropdownTreeSelect data={largeTree} showDropdown="initial" />)
  const contentNode = wrapper.find('.dropdown-content').getDOMNode()

  triggerOnKeyboardKeyDown(wrapper, ['ArrowUp'])
  largeTree.forEach((n, index) => {
    getElementById.withArgs(`${n.id}_li`).returns({ offsetTop: index, clientHeight: 1, scrollIntoView })
  })

  triggerOnKeyboardKeyDown(wrapper, ['ArrowUp'])

  const scrollTop = contentNode.scrollTop

  // Simulate scroll up and setting new props
  contentNode.scrollTop -= 20
  const newTree = largeTree.map(n => {
    return { checked: true, ...n }
  })
  wrapper.setProps({ data: newTree, showDropdown: 'initial' })
  t.notDeepEqual(contentNode.scrollTop, scrollTop)

  // Verify scroll is restored to previous position after keyboard nav
  triggerOnKeyboardKeyDown(wrapper, ['ArrowUp', 'ArrowDown'])
  // Called once for each input, 3 in this case.
  assert.calledThrice(scrollIntoView)

  getElementById.restore()
})

const keyDownTests = [
  { keyCode: 13, expected: true }, // Enter
  { keyCode: 32, expected: true }, // Space
  { keyCode: 40, expected: true }, // Arrow down
  { keyCode: 9, expected: false }, // Tab
  { keyCode: 38, expected: false }, // Up arrow
]

keyDownTests.forEach(testArgs => {
  test(`Key code ${testArgs.keyCode} ${testArgs.expected ? 'can' : "can't"} open dropdown on keyDown`, t => {
    const wrapper = mount(<DropdownTreeSelect data={tree} />)
    const trigger = wrapper.find('.dropdown-trigger')
    trigger.instance().focus()
    trigger.simulate('keyDown', { key: 'mock', keyCode: testArgs.keyCode })
    t.is(wrapper.state().showDropdown, testArgs.expected)
  })
})

test(`Key event should not trigger if not focused/active element`, t => {
  const wrapper = mount(<DropdownTreeSelect data={tree} />)
  const trigger = wrapper.find('.dropdown-trigger')
  const input = wrapper.find('.search')
  input.instance().focus()
  trigger.simulate('keyDown', { key: 'mock', keyCode: 13 })
  t.is(wrapper.state().showDropdown, false)
})
