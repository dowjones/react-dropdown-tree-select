import TreeManager from './index'

describe('TreeManager', () => {
  it('should not mutate input', () => {
    const expected = {
      label: 'l1',
      value: 'v1',
      children: [{
        label: 'l1c1',
        value: 'l1v1'
      }]
    }
    const actual = {
      label: 'l1',
      value: 'v1',
      children: [{
        label: 'l1c1',
        value: 'l1v1'
      }]
    }
    /* eslint-disable no-new */
    new TreeManager(actual)
    expect(actual).toEqual(expected)
  })

  it('should set initial check state based on parent check state when node check state is not defined', () => {
    const tree = {
      id: 'i1',
      label: 'l1',
      value: 'v1',
      children: [{
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1'
      }],
      checked: true
    }
    const manager = new TreeManager(tree)
    expect(manager.getNodeById('c1').checked).toBe(true)
  })

  it('should set initial check state based on node check state when node check state is defined', () => {
    const tree = {
      id: 'i1',
      label: 'l1',
      value: 'v1',
      children: [{
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
        checked: true
      }]
    }
    const manager = new TreeManager(tree)
    expect(manager.getNodeById('c1').checked).toBe(true)
  })

  it('should set initial check state based on node check state when node check state is defined', () => {
    const tree = {
      id: 'i1',
      label: 'l1',
      value: 'v1',
      children: [{
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
        checked: false
      }]
    }
    const manager = new TreeManager(tree)
    expect(manager.getNodeById('c1').checked).toBe(false)
  })

  it('should get tags based on children check state', () => {
    const tree = {
      id: 'i1',
      label: 'l1',
      value: 'v1',
      children: [{
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
        checked: true
      }]
    }
    const manager = new TreeManager(tree)
    expect(manager.getTags().map(t => t.label)).toEqual(['l1c1'])
  })

  it('should get tags based on parent check state', () => {
    const tree = {
      label: 'l1',
      value: 'v1',
      checked: true,
      children: [{
        label: 'l1c1',
        value: 'l1v1',
        checked: true
      }]
    }
    const manager = new TreeManager(tree)
    expect(manager.getTags().map(t => t.label)).toEqual(['l1'])
  })

  it('should get tags based on multiple parent check state', () => {
    const tree = [{
      label: 'l1',
      value: 'v1',
      checked: true,
      children: [{
        label: 'l1c1',
        value: 'l1v1'
      }]
    }, {
      label: 'l2',
      value: 'v2',
      checked: true,
      children: [{
        label: 'l2c2',
        value: 'l2v2'
      }]
    }]
    const manager = new TreeManager(tree)
    expect(manager.getTags().map(t => t.label)).toEqual(['l1', 'l2'])
  })

  it('should get tags based on multiple parent/child check state', () => {
    const tree = [{
      label: 'l1',
      value: 'v1',
      checked: true,
      children: [{
        label: 'l1c1',
        value: 'l1v1'
      }]
    }, {
      label: 'l2',
      value: 'v2',
      children: [{
        label: 'l2c2',
        value: 'l2v2',
        checked: true
      }]
    }]
    const manager = new TreeManager(tree)
    expect(manager.getTags().map(t => t.label)).toEqual(['l1', 'l2c2'])
  })

  it('should toggle children when checked', () => {
    const tree = {
      id: 'i1',
      label: 'l1',
      value: 'v1',
      children: [{
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1'
      }]
    }
    const manager = new TreeManager(tree)
    manager.setNodeCheckedState('i1', true)
    expect(manager.getNodeById('c1').checked).toBe(true)
  })

  it('should toggle children when unchecked', () => {
    const tree = {
      id: 'i1',
      label: 'l1',
      value: 'v1',
      children: [{
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
        checked: true
      }]
    }
    const manager = new TreeManager(tree)
    manager.setNodeCheckedState('i1', false)
    expect(manager.getNodeById('c1').checked).toBe(false)
  })

  it('should uncheck parent when unchecked', () => {
    const tree = {
      id: 'i1',
      label: 'l1',
      value: 'v1',
      checked: true,
      children: [{
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1'
      }]
    }
    const manager = new TreeManager(tree)
    manager.setNodeCheckedState('c1', false)
    expect(manager.getNodeById('i1').checked).toBe(false)
  })

  it('should uncheck all parents when unchecked', () => {
    const tree = {
      id: 'i1',
      label: 'l1',
      value: 'v1',
      children: [{
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
        children: [{
          id: 'c2',
          label: 'l2c1',
          value: 'l2v1'
        }]
      }]
    }
    const manager = new TreeManager(tree)
    manager.setNodeCheckedState('c2', false)
    expect(manager.getNodeById('c1').checked).toBe(false)
    expect(manager.getNodeById('i1').checked).toBe(false)
  })

  it('should collapse all children when collapsed', () => {
    const tree = {
      id: 'i1',
      label: 'l1',
      value: 'v1',
      expanded: true,
      children: [{
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
        expanded: true,
        children: [{
          id: 'c2',
          label: 'l2c1',
          value: 'l2v1',
          expanded: true
        }]
      }]
    }
    const manager = new TreeManager(tree)
    manager.toggleNodeExpandState('i1')
    expect(manager.getNodeById('c1').expanded).toBe(false)
    expect(manager.getNodeById('c2').expanded).toBe(false)
  })

  it('should expand node (and not children) when expanded', () => {
    const tree = {
      id: 'i1',
      label: 'l1',
      value: 'v1',
      children: [{
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
        children: [{
          id: 'c2',
          label: 'l2c1',
          value: 'l2v1'
        }]
      }]
    }
    const manager = new TreeManager(tree)
    manager.toggleNodeExpandState('i1')
    expect(manager.getNodeById('i1').expanded).toBe(true)
    expect(manager.getNodeById('c1').expanded).toBeFalsy()
    expect(manager.getNodeById('c2').expanded).toBeFalsy()
  })

  it('should get matching nodes when searched', () => {
    const tree = {
      id: 'i1',
      label: 'search me',
      value: 'v1',
      children: [{
        id: 'c1',
        label: 'search me too',
        value: 'l1v1',
        children: [{
          id: 'c2',
          label: 'No one can get me',
          value: 'l2v1'
        }]
      }]
    }
    const manager = new TreeManager(tree)
    const {
      allNodesHidden
    } = manager.filterTree('search')
    expect(allNodesHidden).toBe(false)
    const nodes = ['i1', 'c1']
    nodes.forEach(n => expect(manager.getNodeById(n).hide).toBe(false))
  })

  it('should hide all nodes when search term is not found', () => {
    const tree = {
      id: 'i1',
      label: 'l1',
      value: 'v1',
      children: [{
        id: 'c1',
        label: 'l1c1',
        value: 'l1v1',
        children: [{
          id: 'c2',
          label: 'l2c1',
          value: 'l2v1'
        }]
      }]
    }
    const manager = new TreeManager(tree)
    const {
      allNodesHidden
    } = manager.filterTree('bla-bla')
    expect(allNodesHidden).toBe(true)
    const nodes = ['i1', 'c1']
    nodes.forEach(n => expect(manager.getNodeById(n).hide).toBe(true))
  })

  it('should use cached results for subsequent searches', () => {
    const tree = [{
      id: 'i1',
      label: 'search me',
      value: 'v1',
      children: [{
        id: 'c1',
        label: 'search me too',
        value: 'l1v1',
        children: [{
          id: 'c2',
          label: 'No one can get me',
          value: 'l2v1'
        }]
      }]
    }, {
      id: 'i2',
      label: 'sears',
      value: 'sears'
    }]
    const manager = new TreeManager(tree)
    const {
      allNodesHidden
    } = manager.filterTree('sea')
    manager.filterTree('sear')
    manager.filterTree('on')
    manager.filterTree('search')
    manager.filterTree('search')
    expect(allNodesHidden).toBe(false)
  })

  it('should restore nodes', () => {
    const tree = [{
      id: 'i1',
      label: 'search me',
      value: 'v1',
      children: [{
        id: 'c1',
        label: 'search me too',
        value: 'l1v1',
        children: [{
          id: 'c2',
          label: 'No one can get me',
          value: 'l2v1'
        }]
      }]
    }, {
      id: 'i2',
      label: 'sears',
      value: 'sears'
    }]
    const manager = new TreeManager(tree)
    manager.filterTree('search')
    manager.restoreNodes()
    const visibleNodes = ['i1', 'i2', 'c1', 'c2']
    visibleNodes.forEach(n => expect(manager.getNodeById(n).hide).toBe(false))
  })

  it('should get matching nodes with mixed case when searched', () => {
    const tree = {
      id: 'i1',
      label: 'search me',
      value: 'v1',
      children: [{
        id: 'c1',
        label: 'SeaRch me too',
        value: 'l1v1',
        children: [{
          id: 'c2',
          label: 'No one can get me',
          value: 'l2v1'
        }]
      }]
    }
    const manager = new TreeManager(tree)
    const {
      allNodesHidden
    } = manager.filterTree('SearCH')
    expect(allNodesHidden).toBe(false)
    const nodes = ['i1', 'c1']
    nodes.forEach(n => expect(manager.getNodeById(n).hide).toBe(false))
  })
})
