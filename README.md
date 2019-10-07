# react-hierarchical-dropdown

---

# Overview

This project is a fork of [react-dropdown-tree-select](https://github.com/dowjones/react-dropdown-tree-select) by [@dowjones](https://github.com/dowjones) with some features added:

- Search highlighting
- Singular select (no tag-based selections)
- Support for prepending a component to the dropdown
- Logic for node traversal/expansion/collapse
- Support for hover events on nodes
- Changes to how nodes are selected

```
Please note: this project has been extended to a specific use case.
Your mileage may vary.
```

# Getting Started

Please follow the instructions on the [react-dropdown-tree-select](https://github.com/dowjones/react-dropdown-tree-select) Github page.

# Usage

As noted above, this library extends the existing feature set of [react-dropdown-tree-select](https://github.com/dowjones/react-dropdown-tree-select), with the following properties and associated functionality added:

| Prop                     | Value                 | Description                                                                                                                                |
| ------------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `prependElement`         | Any valid JSX element | This allows for pre-pending an element to the top of the dropdown component (first child of the `.root` element).                          |
| `enforceSingleSelection` | boolean               | When selected, will allow for only selecting a single element (as opposed to the tag-based selection bundled with this library by default) |
| `highlightSearch`        | boolean               | Enables phrase matching/highlighting on search                                                                                             |
| `onNodeHover`            | function              | Provides a callback for mouseover events on individual nodes                                                                               |
| `onInputChange`          | function              | Provides a callback for when the search's input changes                                                                                    |

Example usage:

```jsx
import HierarchicalSelect from 'react-hierarchical-select';

<HierarchicalSelect
  mode="hierarchical"
  showDropdown="always"
  data={menuItems}
  prependElement={
   <div>Foo</div>
  }
  enforceSingleSelection={true}
  highlightSearch={true}
  onChange={this.onChange}
  onNodeHover={this.onNodeHover}
  onInputChange={this.onInputChange}
  onNodeNavigate={this.onNodeNavigate}  
  value={this.props.selected}
/>
```
