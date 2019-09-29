import test from 'ava'
import TreeManager from '..'

test('should not mutate input', t => {
  const expected = {
    label: 'l1',
    value: 'v1',
    children: [
      {
        label: 'l1c1',
        value: 'l1v1',
      },
    ],
  }
  const actual = {
    label: 'l1',
    value: 'v1',
    children: [
      {
        label: 'l1c1',
        value: 'l1v1',
      },
    ],
  }
  /* eslint-disable no-new */
  new TreeManager({ data: actual })
  t.deepEqual(actual, expected)
})

test('should set initial check state based on parent check state when node check state is not defined', t => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    children: [
      {
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
      },
    ],
    checked: true,
  }
  const manager = new TreeManager({ data: tree })
  t.true(manager.getNodeById('c1').checked)
})

test('should set initial check state based on node check state when node check state is defined', t => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    children: [
      {
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
        checked: true,
      },
    ],
  }
  const manager = new TreeManager({ data: tree })
  t.true(manager.getNodeById('c1').checked)
})

test('should set initial check state based on node check state when node check state is defined as false', t => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    children: [
      {
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
        checked: false,
      },
    ],
  }
  const manager = new TreeManager({ data: tree })
  t.false(manager.getNodeById('c1').checked)
})

test('should get tags based on children check state', t => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    children: [
      {
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
        checked: true,
      },
    ],
  }
  const manager = new TreeManager({ data: tree })
  t.deepEqual(manager.tags.map(t => t.label), ['l1c1'])
})

test('should get tags based on parent check state', t => {
  const tree = {
    label: 'l1',
    value: 'v1',
    checked: true,
    children: [
      {
        label: 'l1c1',
        value: 'l1v1',
        checked: true,
      },
    ],
  }
  const manager = new TreeManager({ data: tree })
  t.deepEqual(manager.tags.map(t => t.label), ['l1'])
})

test('should get tags based on multiple parent check state', t => {
  const tree = [
    {
      label: 'l1',
      value: 'v1',
      checked: true,
      children: [
        {
          label: 'l1c1',
          value: 'l1v1',
        },
      ],
    },
    {
      label: 'l2',
      value: 'v2',
      checked: true,
      children: [
        {
          label: 'l2c2',
          value: 'l2v2',
        },
      ],
    },
  ]
  const manager = new TreeManager({ data: tree })
  t.deepEqual(manager.tags.map(t => t.label), ['l1', 'l2'])
})

test('should get tags based on multiple parent/child check state', t => {
  const tree = [
    {
      label: 'l1',
      value: 'v1',
      checked: true,
      children: [
        {
          label: 'l1c1',
          value: 'l1v1',
        },
      ],
    },
    {
      label: 'l2',
      value: 'v2',
      children: [
        {
          label: 'l2c2',
          value: 'l2v2',
          checked: true,
        },
      ],
    },
  ]
  const manager = new TreeManager({ data: tree })
  t.deepEqual(manager.tags.map(t => t.label), ['l1', 'l2c2'])
})

test('should toggle children when checked', t => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    children: [
      {
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
      },
    ],
  }
  const manager = new TreeManager({ data: tree })
  manager.setNodeCheckedState('i1', true)
  t.true(manager.getNodeById('c1').checked)
})

test('should toggle children when unchecked', t => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    children: [
      {
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
        checked: true,
      },
    ],
  }
  const manager = new TreeManager({ data: tree })
  manager.setNodeCheckedState('i1', false)
  t.false(manager.getNodeById('c1').checked)
})

test('should uncheck parent when unchecked', t => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    checked: true,
    children: [
      {
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
      },
    ],
  }
  const manager = new TreeManager({ data: tree })
  manager.setNodeCheckedState('c1', false)
  t.false(manager.getNodeById('i1').checked)
})

test('should uncheck all parents when unchecked', t => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    children: [
      {
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
        children: [
          {
            id: 'c2',
            label: 'l2c1',
            value: 'l2v1',
          },
        ],
      },
    ],
  }
  const manager = new TreeManager({ data: tree })
  manager.setNodeCheckedState('c2', false)
  t.false(manager.getNodeById('c1').checked)
  t.false(manager.getNodeById('i1').checked)
})

test('should collapse all children when collapsed', t => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    expanded: true,
    children: [
      {
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
        expanded: true,
        children: [
          {
            id: 'c2',
            label: 'l2c1',
            value: 'l2v1',
            expanded: true,
          },
        ],
      },
    ],
  }
  const manager = new TreeManager({ data: tree })
  manager.toggleNodeExpandState('i1')
  t.false(manager.getNodeById('c1').expanded)
  t.false(manager.getNodeById('c2').expanded)
})

test('should expand node (and not children) when expanded', t => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    children: [
      {
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
        children: [
          {
            id: 'c2',
            label: 'l2c1',
            value: 'l2v1',
          },
        ],
      },
    ],
  }
  const manager = new TreeManager({ data: tree })
  manager.toggleNodeExpandState('i1')
  t.true(manager.getNodeById('i1').expanded)
  t.falsy(manager.getNodeById('c1').expanded)
  t.falsy(manager.getNodeById('c2').expanded)
})

test('should get matching nodes when searched', t => {
  const tree = {
    id: 'i1',
    label: 'search me',
    value: 'v1',
    children: [
      {
        id: 'c1',
        label: 'search me too',
        value: 'l1v1',
        children: [
          {
            id: 'c2',
            label: 'No one can get me',
            value: 'l2v1',
          },
        ],
      },
    ],
  }
  const manager = new TreeManager({ data: tree })
  const { allNodesHidden, tree: matchTree } = manager.filterTree('search')
  t.false(allNodesHidden)
  const nodes = ['i1', 'c1']
  nodes.forEach(n => t.not(matchTree.get(n), undefined))
  t.is(matchTree.get('c2'), undefined)
})

test('should hide all nodes when search term is not found', t => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    children: [
      {
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
        children: [
          {
            id: 'c2',
            label: 'l2c1',
            value: 'l2v1',
          },
        ],
      },
    ],
  }
  const manager = new TreeManager({ data: tree })
  const { allNodesHidden } = manager.filterTree('bla-bla')
  t.true(allNodesHidden)
})

test('should use cached results for subsequent searches', t => {
  const tree = [
    {
      id: 'i1',
      label: 'search me',
      value: 'v1',
      children: [
        {
          id: 'c1',
          label: 'search me too',
          value: 'l1v1',
          children: [
            {
              id: 'c2',
              label: 'No one can get me',
              value: 'l2v1',
            },
          ],
        },
      ],
    },
    {
      id: 'i2',
      label: 'sears',
      value: 'sears',
    },
  ]
  const manager = new TreeManager({ data: tree })
  const { allNodesHidden } = manager.filterTree('sea')
  manager.filterTree('sear')
  manager.filterTree('on')
  manager.filterTree('search')
  manager.filterTree('search')
  t.false(allNodesHidden)
})

test('should restore nodes', t => {
  const tree = [
    {
      id: 'i1',
      label: 'search me',
      value: 'v1',
      children: [
        {
          id: 'c1',
          label: 'search me too',
          value: 'l1v1',
          children: [
            {
              id: 'c2',
              label: 'No one can get me',
              value: 'l2v1',
            },
          ],
        },
      ],
    },
    {
      id: 'i2',
      label: 'sears',
      value: 'sears',
    },
  ]
  const manager = new TreeManager({ data: tree })
  manager.filterTree('search')
  manager.restoreNodes()
  const visibleNodes = ['i1', 'i2', 'c1', 'c2']
  visibleNodes.forEach(n => t.false(manager.getNodeById(n).hide))
})

test('should get matching nodes with mixed case when searched', t => {
  const tree = {
    id: 'i1',
    label: 'search me',
    value: 'v1',
    children: [
      {
        id: 'c1',
        label: 'SeaRch me too',
        value: 'l1v1',
        children: [
          {
            id: 'c2',
            label: 'No one can get me',
            value: 'l2v1',
          },
        ],
      },
    ],
  }
  const manager = new TreeManager({ data: tree })
  const { allNodesHidden, tree: matchTree } = manager.filterTree('SearCH')
  t.false(allNodesHidden)
  const nodes = ['i1', 'c1']
  nodes.forEach(n => t.not(matchTree.get(n), undefined))
  t.is(matchTree.get('c2'), undefined)
})

test('should get matching nodes when using custom search predicate', t => {
  const tree = {
    id: 'i1',
    label: 'search me',
    value: 'v1',
    children: [
      {
        id: 'c1',
        label: 'SeaRch me too',
        value: 'l1v1',
        children: [
          {
            id: 'c2',
            label: 'I have some extra data to filter on',
            customField: "I'm a little TeApOt",
            value: 'l2v1',
          },
        ],
      },
    ],
  }
  const searchPredicate = (node, term) => node.customField && node.customField.toLowerCase().indexOf(term) >= 0
  const manager = new TreeManager({ data: tree, searchPredicate })
  const { allNodesHidden, tree: matchTree } = manager.filterTree('tEaPoT')
  t.false(allNodesHidden)
  const nodes = ['i1', 'c1']
  nodes.forEach(n => t.is(matchTree.get(n), undefined))
  t.not(matchTree.get('c2'), undefined)
})

test('should uncheck previous node in simple select mode', t => {
  const tree = [
    {
      id: 'i1',
      label: 'l1',
      value: 'v1',
      children: [
        {
          id: 'c1',
          label: 'l1c1',
          value: 'l1v1',
        },
      ],
    },
    {
      id: 'i2',
      label: 'l2',
      value: 'v2',
      children: [
        {
          id: 'c2',
          label: 'l2c2',
          value: 'l2v2',
        },
      ],
    },
  ]
  const manager = new TreeManager({ data: tree, mode: 'simpleSelect' })
  manager.setNodeCheckedState('i1', true)
  t.true(manager.getNodeById('i1').checked)

  manager.setNodeCheckedState('i2', true)
  t.false(manager.getNodeById('i1').checked)
  t.true(manager.getNodeById('i2').checked)

  manager.setNodeCheckedState('i1', true)
  t.true(manager.getNodeById('i1').checked)
  t.false(manager.getNodeById('i2').checked)
})

test('should restore default values', t => {
  const tree = [
    {
      id: 'i1',
      label: 'l1',
      value: 'v1',
      children: [
        {
          id: 'c1',
          label: 'l1c1',
          value: 'l1v1',
          isDefaultValue: true,
        },
      ],
    },
    {
      id: 'i2',
      label: 'l2',
      value: 'v2',
      isDefaultValue: true,
      children: [
        {
          id: 'c2',
          label: 'l2c2',
          value: 'l2v2',
        },
      ],
    },
  ]
  const manager = new TreeManager({ data: tree })
  manager.setNodeCheckedState('c1', false)
  t.false(manager.getNodeById('c1').checked)

  manager.setNodeCheckedState('i2', false)
  t.false(manager.getNodeById('i2').checked)

  manager.restoreDefaultValues()
  t.true(manager.getNodeById('c1').checked)
  t.true(manager.getNodeById('i2').checked)
})

test('should return children when search with `keepChildrenOnSearch`', t => {
  const tree = [
    {
      id: 'i1',
      label: 'search me',
      value: 'v1',
      children: [
        {
          id: 'c1',
          label: 'SeaRch me too',
          value: 'l1v1',
          children: [
            {
              id: 'c2',
              label: 'You can see me',
              value: 'l2v1',
            },
          ],
        },
      ],
    },
  ]
  const manager = new TreeManager({ data: tree })
  const keepTreeOnSearch = true
  const keepChildrenOnSearch = true
  const { allNodesHidden, tree: matchTree } = manager.filterTree('search me', keepTreeOnSearch, keepChildrenOnSearch)
  t.false(allNodesHidden)
  const nodes = ['i1', 'c1', 'c2']
  nodes.forEach(n => t.not(matchTree.get(n), undefined))
})

test('should not hide parent nodes if they match search term with `keepTreeOnSearch`', t => {
  const tree = [
    {
      id: 'i1',
      label: 'A top level item',
      value: 'v1',
      children: [
        {
          id: 'c1',
          label: 'SeaRch me too',
          value: 'l1v1',
          children: [
            {
              id: 'c2',
              label: 'search me, please!',
              value: 'l2v1',
            },
          ],
        },
      ],
    },
  ]
  const manager = new TreeManager({ data: tree })
  const keepTreeOnSearch = true
  const { allNodesHidden, tree: matchTree } = manager.filterTree('search me', keepTreeOnSearch)
  t.false(allNodesHidden)
  const nodes = ['c1', 'c2']
  nodes.forEach(n => {
    t.not(matchTree.get(n), undefined, `${n} should not be undefined.`)
    t.false(manager.getNodeById(n).hide, `${n} should not be hidden.`)
  })

  const hiddenNodes = ['i1']
  hiddenNodes.forEach(n => t.true(manager.getNodeById(n).hide, `${n} should not be visible.`))
})
