# Doing more with HOCs

This documentation is about expanding react-dropdown-tree-select using Higher Order Components/Functions.

## Table of Contents

* [What are HOCs](#what-are-hocs)
* [Why use a HOC](#why-use-a-hoc)
* [Examples](#examples)
  * [External Select All, Unselect All buttons](#external-select-all--unselect-all-buttons)
  * [Internal Select All Checkbox](#internal-select-all-checkbox)
  * [Prevent re-render on parent prop/state changes](#prevent-re-render-on-parent-prop-state-changes)
  * [Tree Node Paths](#tree-node-paths)

## What are HOCs

HOCs (or Higher Order Components/Functions) are either a React Component (or a function that returns a React Component) that are used to enhance the functionality of an existing component.

You can use HOCs to manipulate the props and state, abstract rendering logic or enable code reuse.

## Why use a HOC

Or in other words, why is this functionality not baked in to the component? It's a fair question. There are many reasons but probably the biggest reason is - to _Keep It Simple_!

The control tries to provide a minimal, core set of features while making it easy to expand upon the core features using composition, or HOCs. This lets the component to have a very small footprint and allows you to customize/tweak or build upon as per your requirements.

## Examples

These are some of the examples of expanding the core component with HOCs. They are all provided as Code Sandboxes so feel free to play with them.

If you'd like to add to these examples, create an issue with a brief description (of what the HOC does) along with a CodeSandbox link.

### External Select All, Unselect All buttons

This is an example of selecting/unselecting all nodes programmatically, outside of the control.

![External Select/Unselect All buttons screenshot](https://user-images.githubusercontent.com/781818/37561174-6120362a-2a1e-11e8-914d-48636ed6e7d3.png)

[![Edit n348v2qox0](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/n348v2qox0)

### Internal Select All Checkbox

This example shows how to add a special Select All checkbox within the dropdown itself.

![Internal Select All Checkbox screenshot](https://user-images.githubusercontent.com/781818/37561139-7066396e-2a1d-11e8-99d0-02c24acbef3a.png)

[![Edit rjwqq86p1n](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rjwqq86p1n)

### Prevent re-render on parent prop/state changes

Once initialized, the component (react-dropdown-tree-select) manages its own internal state. However, if this component is part of another component, then due to React's nature, anytime the parent is re-rendered, this component will re-render. While React's Virtual DOM diffing will cancel out any ultimate DOM modifications, it'll still go through all of its initialization process. This can be a waste of computation if the tree data hasn't changed.

To prevent that, this HOC simply adds a deep equality check in its `shouldComponentUpdate`.

This is not baked in the component since:

* Deep equality check can be expensive if the tree is large
* Not everyone may need this check

[![Edit Prevent re-render on parent render with React Dropdown Tree Select](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/v05klkn56l)

### Tree Node Paths

The `onChange`/`onNodeToggle` events bubbles up few useful properties such as `_depth`, `_id`, `_parent` (and `_children` for non-leaf nodes). Using these, you can recurse up/down to grab a node in the tree.

In addition, you can use the object path notation to grab the node without recursion. This HOC demonstrates a technique to do that.

![Tree Node Paths screenshot](https://user-images.githubusercontent.com/781818/37561835-7729112e-2a2f-11e8-8f5b-c04f227e49b2.png)

[![Edit Tree node paths with React Dropdown Tree Select](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/l765q6lmrq)
