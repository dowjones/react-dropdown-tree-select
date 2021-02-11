import test from 'ava'
import React from 'react'
import { shallow, mount } from 'enzyme'
import { spy } from 'sinon'
import toJson from 'enzyme-to-json'
import DropdownTreeSelect from './index'
import { clientIdGenerator } from './utils'

const dropdownId = 'rdts'

const action = {
  id: 'NOT',
  title: 'NOT',
  className: 'fa fa-ban',
}

const node0 = {
  _id: `${dropdownId}-0`,
  _children: [`${dropdownId}-0-0`, `${dropdownId}-0-1`],
  _depth: 0,
  label: 'item1',
  value: 'value1',
  children: undefined,
  actions: [action],
}

const nativeEvent = { stopImmediatePropagation: spy() }

test.beforeEach(t => {
  t.context.tree = [
    {
      label: 'item1',
      value: 'value1',
      children: [
        {
          label: 'item1-1',
          value: 'value1-1',
          children: [{ label: 'item1-1-1', value: 'value1-1-1' }, { label: 'item1-1-2', value: 'value1-1-2' }],
        },
        { label: 'item1-2', value: 'value1-2' },
      ],
      actions: [action],
    },
    {
      label: 'item2',
      value: 'value2',
      children: [
        {
          label: 'item2-1',
          value: 'value2-1',
          children: [
            { label: 'item2-1-1', value: 'value2-1-1' },
            { label: 'item2-1-2', value: 'value2-1-2' },
            {
              label: 'item2-1-3',
              value: 'value2-1-3',
              children: [{ label: 'item2-1-3-1', value: 'value2-1-3-1' }],
            },
          ],
        },
        { label: 'item2-2', value: 'value2-2' },
      ],
    },
  ]
})

test('renders default state', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect id={dropdownId} data={tree} />)
  t.snapshot(toJson(wrapper))
})

test('renders default radio select state', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect id={dropdownId} data={tree} mode="radioSelect" />)
  t.snapshot(toJson(wrapper))
})

test('shows dropdown', t => {
  const { tree } = t.context
  const wrapper = shallow(<DropdownTreeSelect id={dropdownId} data={tree} showDropdown="initial" />)
  t.snapshot(toJson(wrapper))
})

test('always shows dropdown', t => {
  const { tree } = t.context
  const wrapper = shallow(<DropdownTreeSelect id={dropdownId} data={tree} showDropdown="always" />)
  t.snapshot(toJson(wrapper))
})

test('always shows dropdown with inline search Input', t => {
  const { tree } = t.context
  const wrapper = shallow(<DropdownTreeSelect id={dropdownId} data={tree} inlineSearchInput showDropdown="always" />)
  t.snapshot(toJson(wrapper))
})

test('keeps dropdown open for showDropdown: always', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect id={dropdownId} data={tree} showDropdown="always" />)
  wrapper.find('.search').simulate('click')
  t.true(wrapper.exists('.dropdown-content'))
  const event = new MouseEvent('click', { bubbles: true, cancelable: true })
  global.document.dispatchEvent(event)
  wrapper.update()
  t.true(wrapper.exists('.dropdown-content'))
})

test('notifies on action', t => {
  const handler = spy()
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect id={dropdownId} data={tree} onAction={handler} showDropdown="initial" />)
  wrapper.find('button.fa-ban').simulate('click')
  t.true(handler.calledWithExactly(node0, action))
})

test('notifies on action without onAction handler', t => {
  const handler = spy(console, 'error')
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect id={dropdownId} data={tree} showDropdown="initial" />)
  wrapper.find('button.fa-ban').simulate('click')
  t.true(handler.notCalled)
  handler.restore()
})

test('notifies on node toggle', t => {
  const handler = spy()
  const { tree } = t.context
  const wrapper = mount(
    <DropdownTreeSelect id={dropdownId} data={tree} onNodeToggle={handler} showDropdown="initial" />
  )
  wrapper.find(`#${node0._id}_li .toggle`).simulate('click', { nativeEvent })
  t.true(handler.calledWithExactly({ ...node0, expanded: true }))
})

test('notifies on checkbox change', t => {
  const handler = spy()
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect id={dropdownId} data={tree} onChange={handler} showDropdown="initial" />)
  wrapper.find(`input#${node0._id}`).simulate('change', { target: { checked: true }, nativeEvent })
  t.true(
    handler.calledWithExactly({ ...node0, _focused: true, checked: true }, [
      { ...node0, _focused: true, checked: true },
    ])
  )
})

test('notifies on tag removal', t => {
  const handler = spy()
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect id={dropdownId} data={tree} onChange={handler} showDropdown="initial" />)
  wrapper.find(`input#${node0._id}`).simulate('change', { target: { checked: true }, nativeEvent })
  wrapper.find(`#${node0._id}_button`).simulate('click', { nativeEvent })
  t.true(handler.calledWithExactly({ ...node0, _focused: true, checked: false }, []))
})

test('sets search mode on input change', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect data={tree} />)
  wrapper.find('.search').simulate('click')
  wrapper.find('.search').simulate('change', { target: { value: 'item1-1-1' } })
  t.is(wrapper.find('.node').length, 1)
})

test('hides dropdown onChange for simpleSelect', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect id={dropdownId} showDropdown="initial" data={tree} mode="simpleSelect" />)
  t.true(wrapper.exists('.dropdown-content'))
  wrapper.find(`input#${node0._id}`).simulate('change', { target: { checked: true }, nativeEvent })
  t.false(wrapper.exists('.dropdown-content'))
})

test('keeps dropdown open onChange for simpleSelect and keepOpenOnSelect', t => {
  const { tree } = t.context
  const wrapper = mount(
    <DropdownTreeSelect id={dropdownId} data={tree} showDropdown="initial" mode="simpleSelect" keepOpenOnSelect />
  )
  t.true(wrapper.exists('.dropdown-content'))
  wrapper.find(`input#${node0._id}`).simulate('change', { target: { checked: true }, nativeEvent })
  t.true(wrapper.exists('.dropdown-content'))
})

test('clears input onChange for clearSearchOnChange', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect id={dropdownId} data={tree} showDropdown="initial" clearSearchOnChange />)
  wrapper.find('.search').getDOMNode().value = 'it'
  wrapper.find(`input#${node0._id}`).simulate('change', { target: { checked: true }, nativeEvent })
  t.is(wrapper.find('.search').getDOMNode().value, '')
})

test('toggles dropdown', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect data={tree} />)
  wrapper.find('.search').simulate('click')
  t.true(wrapper.exists('.dropdown-content'))
  wrapper.find('.search').simulate('click')
  t.false(wrapper.exists('.dropdown-content'))
})

test('keeps dropdown open on props update', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect data={tree} />)
  wrapper.find('.search').simulate('click')
  t.true(wrapper.exists('.dropdown-content'))
  wrapper.setProps({ data: tree })
  t.true(wrapper.exists('.dropdown-content'))
})

test('opens dropdown on props update with show intention', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect data={tree} />)
  t.false(wrapper.exists('.dropdown-content'))
  wrapper.setProps({ data: tree, showDropdown: 'initial' })
  wrapper.update()
  t.true(wrapper.exists('.dropdown-content'))
  wrapper.find('.search').simulate('click')
  t.false(wrapper.exists('.dropdown-content'))
  wrapper.setProps({ data: tree, showDropdown: 'always' })
  wrapper.find('.search').simulate('click')
  t.true(wrapper.exists('.dropdown-content'))
})

test('sets unique ids on dropdowns', t => {
  const { tree } = t.context
  clientIdGenerator.reset()
  const wrapper1 = mount(<DropdownTreeSelect data={tree} />)
  const wrapper2 = mount(<DropdownTreeSelect data={tree} />)

  t.regex(wrapper1.getDOMNode().id, /^rdts\d+$/)
  t.regex(wrapper2.getDOMNode().id, /^rdts\d+$/)
  t.notDeepEqual(wrapper1.getDOMNode().id, wrapper2.getDOMNode().id)
})

test("doesn't toggle dropdown if it's disabled", t => {
  const { tree } = t.context
  const wrapper = shallow(<DropdownTreeSelect id={dropdownId} data={tree} disabled />)
  t.snapshot(toJson(wrapper))
})

test('keeps dropdown active on focus', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect id={dropdownId} data={tree} />)
  wrapper.find('.search').simulate('click')
  t.true(wrapper.exists('.dropdown-content'))
  wrapper.find(`input#${node0._id}`).simulate('change', { target: { checked: true }, nativeEvent })
  wrapper.find('.search').simulate('focus')
  wrapper.find('.search').simulate('click')
  t.true(wrapper.exists('.dropdown-content'))
})

test('deactivates dropdown active on blur', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect id={dropdownId} data={tree} />)
  wrapper.find('.search').simulate('click')
  t.true(wrapper.exists('.dropdown-content'))
  wrapper.find(`input#${node0._id}`).simulate('change', { target: { checked: true }, nativeEvent })
  wrapper.find('.search').simulate('focus')
  wrapper.find('.search').simulate('click')
  wrapper.find('.search').simulate('blur')
  wrapper.find('.search').simulate('keydown', { key: 'Tab' })
  t.false(wrapper.exists('.dropdown-content'))
})

test('detects click outside', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect data={tree} />)

  wrapper.find('.search').simulate('click')
  t.true(wrapper.exists('.dropdown-content'))

  const event = new MouseEvent('click', { bubbles: true, cancelable: true })
  global.document.dispatchEvent(event)

  wrapper.update()
  t.false(wrapper.exists('.dropdown-content'))
})

test('detects click inside', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect data={tree} />)

  wrapper.find('.search').simulate('click')
  t.true(wrapper.exists('.dropdown-content'))

  const checkboxItem = wrapper.getDOMNode().getElementsByClassName('checkbox-item')[0]
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
    target: checkboxItem,
  })
  Object.defineProperty(event, 'target', { value: checkboxItem, enumerable: true })
  global.document.dispatchEvent(event)

  wrapper.update()
  t.true(wrapper.exists('.dropdown-content'))
})

test('detects click outside when other dropdown instance', t => {
  const { tree } = t.context
  const wrapper1 = mount(<DropdownTreeSelect data={tree} />)
  const wrapper2 = mount(<DropdownTreeSelect data={tree} />)

  wrapper1.find('.search').simulate('click')
  t.true(wrapper1.exists('.dropdown-content'))

  const searchInput = wrapper2.getDOMNode().getElementsByClassName('search')[0]
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
    target: searchInput,
  })
  Object.defineProperty(event, 'target', { value: searchInput, enumerable: true })
  global.document.dispatchEvent(event)

  wrapper1.update()
  t.false(wrapper1.exists('.dropdown-content'))
})

test('adds aria-labelledby when label contains # to search input', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect data={tree} texts={{ label: '#hello #world' }} />)
  t.deepEqual(wrapper.find('.search').prop('aria-labelledby'), 'hello world')
  t.deepEqual(wrapper.find('.search').prop('aria-label'), undefined)
})

test('adds aria-label when having label on search input', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect data={tree} texts={{ label: 'hello world' }} />)
  t.deepEqual(wrapper.find('.search').prop('aria-labelledby'), undefined)
  t.deepEqual(wrapper.find('.search').prop('aria-label'), 'hello world')
})

test('appends selected tags to aria-labelledby with provided aria-labelledby', t => {
  const { tree } = t.context
  tree[0].checked = true
  const wrapper = mount(<DropdownTreeSelect id="rdts" data={tree} texts={{ label: '#hello #world' }} />)
  t.deepEqual(wrapper.find('.dropdown-trigger').prop('aria-labelledby'), 'hello world rdts-0_tag')
  t.deepEqual(wrapper.find('.dropdown-trigger').prop('aria-label'), undefined)
})

test('appends selected tags to aria-labelledby with text label', t => {
  const { tree } = t.context
  tree[0].checked = true
  const wrapper = mount(<DropdownTreeSelect id="rdts" data={tree} texts={{ label: 'hello world' }} />)
  t.deepEqual(wrapper.find('.dropdown-trigger').prop('aria-labelledby'), 'rdts_trigger rdts-0_tag')
  t.deepEqual(wrapper.find('.dropdown-trigger').prop('aria-label'), 'hello world')
})

test('default tabIndex value is 0', t => {
  const { tree } = t.context
  tree[0].checked = true
  const wrapper = mount(<DropdownTreeSelect id="rdts" data={tree} />)
  t.deepEqual(wrapper.find('.dropdown-trigger').prop('tabIndex'), 0)
})

test('set tabIndex value', t => {
  const { tree } = t.context
  tree[0].checked = true
  const wrapper = mount(<DropdownTreeSelect id="rdts" data={tree} tabIndex={5} />)
  t.deepEqual(wrapper.find('.dropdown-trigger').prop('tabIndex'), 5)
})

test('select correct focused node when using external state data container', t => {
  const data = [
    {
      label: 'All data',
      value: '0',
      checked: false,
    },
    {
      label: 'iWay',
      value: '1',
      checked: false,
    },
  ]
  const wrapper = mount(<DropdownTreeSelect id={dropdownId} data={data} showDropdown="initial" />)
  const nodeAllData = {
    _id: `${dropdownId}-0`,
    _depth: 0,
    label: 'All data',
    value: '0',
    children: undefined,
    actions: [action],
  }
  wrapper.find(`input#${nodeAllData._id}`).simulate('change', { target: { checked: true }, nativeEvent })
  // simulate external change to the data props.
  wrapper.setProps({
    data: [
      {
        label: 'All data',
        value: '0',
        checked: true,
      },
      {
        label: 'iWay',
        value: '1',
        checked: false,
      },
    ],
  })
  t.deepEqual(wrapper.find('.focused').prop('id'), `${nodeAllData._id}_li`)
})

test('should not scroll on select', t => {
  const node = (id, label) => ({ id, label, value: label })
  const largeTree = [...Array(150).keys()].map(i => node(`id${i}`, `label${i}`))
  const wrapper = mount(<DropdownTreeSelect data={largeTree} showDropdown="initial" />)
  const { scrollTop } = wrapper.find('.dropdown-content').getDOMNode()

  t.deepEqual(scrollTop, 0)

  const checkboxes = wrapper.find('.checkbox-item')
  checkboxes.at(140).simulate('click')

  t.deepEqual(scrollTop, 0)
})
