# react-dropdown-tree-select

---

[![NPM version][npm-image]][npm-url] [![gzip][gzip-image]][gzip-url] [![npm download][download-image]][npm-url]

[![build status][travis-image]][travis-url] [![Test coverage][coveralls-image]][coveralls-url] [![Commitizen friendly][commitizen]][commitizen-url] [![semantic-release][semantic-release]][semantic-release-url] [![All Contributors](https://img.shields.io/badge/all_contributors-20-orange.svg?style=flat-square)](#contributors)

[npm-image]: http://img.shields.io/npm/v/react-dropdown-tree-select.svg?style=flat-square
[npm-url]: http://npmjs.org/package/react-dropdown-tree-select
[travis-image]: https://img.shields.io/travis/dowjones/react-dropdown-tree-select.svg?style=flat-square
[travis-url]: https://travis-ci.org/dowjones/react-dropdown-tree-select
[coveralls-image]: https://img.shields.io/coveralls/dowjones/react-dropdown-tree-select.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/dowjones/react-dropdown-tree-select?branch=master
[download-image]: https://img.shields.io/npm/dt/react-dropdown-tree-select.svg?style=flat-square
[commitizen]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square
[commitizen-url]: http://commitizen.github.io/cz-cli/
[gzip-image]: http://img.badgesize.io/https://unpkg.com/react-dropdown-tree-select/dist/react-dropdown-tree-select.js?compression=gzip&style=flat-square
[gzip-url]: https://unpkg.com/react-dropdown-tree-select/dist/react-dropdown-tree-select.js
[semantic-release]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square
[semantic-release-url]: https://github.com/semantic-release/semantic-release

## React Dropdown Tree Select

A lightweight and fast control to render a select component that can display hierarchical tree data. In addition, the control shows the selection in pills and allows user to search the options for quick filtering and selection. Also supports displaying partially selected nodes.

## Table of Contents

- [Screenshot](#screenshot)
- [Demo](#example)
  - [Vanilla (no framework)](#vanilla-no-framework)
  - [With Bootstrap](#with-bootstrap)
  - [With Material Design](#with-material-design)
  - [As Single Select](#as-single-select)
- [Install](#install)
  - [As NPM package](#as-npm-package)
  - [Using a CDN](#using-a-cdn)
  - [Peer Dependencies](#peer-dependencies)
- [Usage](#usage)
- [Props](#props)
  - [className](#classname)
  - [clearSearchOnChange](#clearsearchonchange)
  - [onChange](#onchange)
  - [onNodeToggle](#onnodetoggle)
  - [data](#data)
  - [placeholderText](#placeholdertext)
  - [noMatchesText](#nomatchestext)
  - [keepTreeOnSearch](#keeptreeonsearch)
  - [simpleSelect](#simpleselect)
  - [showPartiallySelected](#showpartiallyselected)
  - [showDropdown](#showDropdown)
- [Styling and Customization](#styling-and-customization)
  - [Using default styles](#default-styles)
  - [Customizing with Bootstrap, Material Design styles](#customizing-styles)
- [Performance](#performance)
  - [Search optimizations](#search-optimizations)
  - [Search debouncing](#search-debouncing)
  - [Virtualized rendering](#virtualized-rendering)
  - [Reducing costly DOM manipulations](#reducing-costly-dom-manipulations)
- [FAQ](#faq)
- [Doing more with HOCs](/docs/HOC.md)
- [Development](#development)
- [License](#license)

## Screenshot

![animated demo screenshot](https://user-images.githubusercontent.com/781818/37562235-0ae9e9ec-2a3a-11e8-8266-b0e6b716d0d1.gif)

## Demo

##### Vanilla, no framework

Online demo: https://dowjones.github.io/react-dropdown-tree-select/#/story/with-vanilla-styles

##### With Bootstrap

Online demo: https://dowjones.github.io/react-dropdown-tree-select/#/story/with-bootstrap-styles

##### With Material Design

Online demo: https://dowjones.github.io/react-dropdown-tree-select/#/story/with-material-design-styles

##### As Single Select

Online demo: https://dowjones.github.io/react-dropdown-tree-select/#/story/simple-select

## Install

### As NPM package

```js
npm i react-dropdown-tree-select

// or if using yarn
yarn add react-dropdown-tree-select
```

### Using a CDN

You can import the standalone UMD build from a CDN such as:

```html
<script src="https://unpkg.com/react-dropdown-tree-select/dist/react-dropdown-tree-select.js"></script>
<link href="https://unpkg.com/react-dropdown-tree-select/dist/styles.css" rel="stylesheet">
```

**Note:** Above example will always fetch the latest version. To fetch a specific version, use `https://unpkg.com/react-dropdown-tree-select@<version>/dist/...`
Visit [unpkg.com](https://unpkg.com/#/) to see other options.

### Peer Dependencies

In order to avoid version conflicts in your project, you must specify and install [react](https://www.npmjs.com/package/react), [react-dom](https://www.npmjs.com/package/react-dom) as [peer dependencies](https://nodejs.org/en/blog/npm/peer-dependencies/). Note that NPM doesn't install peer dependencies automatically. Instead it will show you a warning message with instructions on how to install them.

If you're using the UMD builds, you'd also need to install the peer dependencies in your application:

```html
<script src="https://unpkg.com/react/dist/react.js"></script>
<script src="https://unpkg.com/react-dom/dist/react-dom.js"></script>
```

## Usage

```jsx
import React from 'react'
import ReactDOM from 'react-dom'

import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'

const data = {
  label: 'search me',
  value: 'searchme',
  children: [
    {
      label: 'search me too',
      value: 'searchmetoo',
      children: [
        {
          label: 'No one can get me',
          value: 'anonymous'
        }
      ]
    }
  ]
}

const onChange = (currentNode, selectedNodes) => {
  console.log('onChange::', currentNode, selectedNodes)
}
const onAction = ({ action, node }) => {
  console.log(`onAction:: [${action}]`, node)
}
const onNodeToggle = currentNode => {
  console.log('onNodeToggle::', currentNode)
}

ReactDOM.render(<DropdownTreeSelect data={data} onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle} />, document.body) // in real world, you'd want to render to an element, instead of body.
```

## Props

### className

Type: `string`

Additional classname for container. The container renders with a default classname of `react-dropdown-tree-select`.

### clearSearchOnChange

Type: `bool`

Clear the input search if a node has been selected/unselected.

### onChange

Type: `function`

Fires when a node change event occurs. Currently the following actions trigger a node change:

- Checkbox click which checks/unchecks the item
- Closing of pill (which unchecks the corresponding checkbox item)

Calls the handler with the current node object and all selected nodes (if any). Example:

```jsx
function onChange(currentNode, selectedNodes) {
  // currentNode: { label, value, children, expanded, checked, className, ...extraProps }
  // selectedNodes: [{ label, value, children, expanded, checked, className, ...extraProps }]
}

return <DropdownTreeSelect data={data} onChange={onChange} />
```

### onNodeToggle

Type: `function`

Fires when a node is expanded or collapsed.

Calls the handler with the current node object. Example:

```jsx
function onNodeToggle(currentNode) {
  // currentNode: { label, value, children, expanded, checked, className, ...extraProps }
}

return <DropdownTreeSelect data={data} onNodeToggle={onNodeToggle} />
```

### onFocus

Type: `function`

Fires when input box receives focus or the dropdown arrow is clicked. This is helpful for setting `dirty` or `touched` flags with forms.

### onBlur

Type: `function`

Fires when input box loses focus or the dropdown arrow is clicked again (and the dropdown collapses). This is helpful for setting `dirty` or `touched` flags with forms.

### data

Type: `Object` or `Array`

Data for rendering the tree select items. The object requires the following structure:

```js
{
  label,          // required: Checkbox label
  value,          // required: Checkbox value
  children,       // optional: Array of child objects
  checked,        // optional: Initial state of checkbox. if true, checkbox is selected and corresponding pill is rendered.
  disabled,       // optional: Selectable state of checkbox. if true, the checkbox is disabled and the node is not selectable.
  expanded,       // optional: If true, the node is expanded (children of children nodes are not expanded by default unless children nodes also have expanded: true).
  className,      // optional: Additional css class for the node. This is helpful to style the nodes your way
  tagClassName,   // optional: Css class for the corresponding tag. Use this to add custom style the pill corresponding to the node.
  actions,        // optional: An array of extra action on the node (such as displaying an info icon or any custom icons/elements)
  dataset,        // optional: Allows data-* attributes to be set on the node and tag elements
  isDefaultValue, // optional: Indicate if a node is a default value. When true, the dropdown will automatically select the node(s) when there is no other selected node. Can be used on more than one node.
  ...             // optional: Any extra properties that you'd like to receive during `onChange` event
}
```

The `action` object requires the following structure:

```js
{
  className, // required: CSS class for the node. e.g. `fa fa-info`
  onAction,  // required: Fired on click of the action. The event handler receives `action` object as well as the `node` object.
  title,     // optional: HTML tooltip text
  text,      // optional: Any text to be displayed. This is helpful to pass ligatures if you're using ligature fonts
  ...        // optional: Any extra properties that you'd like to receive during `onChange` event
}
```

An array renders a tree with multiple root level items whereas an object renders a tree with a single root element (e.g. a `Select All` root node).

### placeholderText

Type: `string`

The text to display as placeholder on the search box. Defaults to `Choose...`

### noMatchesText

Type: `string`

The text to display when the search does not find results in the content list. Defaults to `No matches found`

### keepTreeOnSearch

Type: `bool`

Displays search results as a tree instead of flattened results

### simpleSelect

Type: `bool` (default: `false`)

Turns the dropdown into a simple, single select dropdown. If you pass tree data, only immediate children are picked, grandchildren nodes are ignored. Defaults to `false`.

### showPartiallySelected

Type: `bool` (default: `false`)

If set to true, shows checkboxes in a partial state when one, but not all of their children are selected. Allows styling of partially selected nodes as well, by using [:indeterminate](https://developer.mozilla.org/en-US/docs/Web/CSS/:indeterminate) pseudo class. Simply add desired styles to `.node.partial .checkbox-item:indeterminate { ... }` in your CSS.

### showDropdown

Type: `bool` (default: `false`)

If set to true, shows the dropdown when rendered. This can be used to render the component with the dropdown open as its initial state.

## Styling and Customization

### Default styles

The component brings minimal styles for bare-bones functional rendering. It is kept purposefully minimal so that user can style/customize it completely to suit their needs.

#### Using WebPack

If you're using a bundler like webpack, make sure you configure webpack to import the default styles. To do so, simply add this rule to your webpack config:

```js
// allow webpack to import/bundle styles from node_modules for this component
module: {
  rules: [
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader'
          }
        ]
      }),
      include: /node_modules[/\\]react-dropdown-tree-select/
    }
  ]
}
```

#### Using a CDN

You can import and place a style link directly by referencing it from a CDN.

```html
<link href="https://unpkg.com/react-dropdown-tree-select/dist/styles.css" rel="stylesheet">
```

Note: Above example will always fetch the latest version. To fetch a specific version, use `https://unpkg.com/react-dropdown-tree-select@<version>/dist/styles.css`. Visit [unpkg.com](https://unpkg.com/#/) to see other options.

#### Using with other bundlers

You can reference the files from `node_modules/react-dropdown-tree-select/dist/styles.css` to include in your own bundle via gulp or any other bundlers you have.

### Customizing styles

Once you import default styles, it is easy to add/override the provided styles to match popular frameworks. Checkout `/docs` folder for some examples.

- [With Bootstrap](/docs/examples/bootstrap)
- [With Material Design ](/docs/examples/material)

## Performance

### Search optimizations

- The tree creates a flat list of nodes from hierarchical tree data to perform searches that are linear in time irrespective of the tree depth or size.
- It also memoizes each search term, so subsequent searches are instantaneous (almost).
- Last but not the least, the search employs progressive filtering technique where subsequent searches are performed on the previous search set. E.g., say the tree has 4000 nodes altogether and the user wants to filter nodes that contain the text: "2002". As the user enters each key press the search goes like this:

```
key press  : 2-----20-----200-----2002
            |     |      |       |
search set: 967   834    49      7
```

The search for "20" happens against the previously matched set of 967 as opposed to all 4000 nodes; "200" happens against 834 nodes and so on.

### Search debouncing

The tree debounces key presses to avoid costly search calculations. The default duration is 100ms.

### Virtualized rendering

The dropdown renders only visible content and skips any nodes that are going to hidden from the user. E.g., if a parent node is not expanded, there is no point in rendering children since they will not be visible anyway.

~~Planned feature: Use [react-virtualized](https://github.com/bvaughn/react-virtualized) to take this to the next level.~~ The search tree now uses infinite scroll, limiting search results to 100 items initially (more load seamlessly as you scroll) - this results in super fast rendering even with large number of nodes (see [#80](https://github.com/dowjones/react-dropdown-tree-select/issues/80)).

### Reducing costly DOM manipulations

The tree tries to minimize the DOM manipulations as much as possible. E.g., during searching, the non-matching nodes are simply `hidden` and css adjusted on remaining to create the perception of a new filtered list.
Node toggling also achieves the expand/collapse effect by manipulating css classes instead of creating new tree with filtered out nodes.

## FAQ

### How do I change the placeholder text?

The default [placeholder](#placeholdertext) is `Choose...`. If you want to change this to something else, you can use `placeholderText` property to set it.

```jsx
<DropdownTreeSelect placeholderText="Search" />
```

### How do I tweak styles?

Easy style customization is one of the design goals of this component. Every visual aspect of this dropdown can be tweaked without going through extensive hacks. E.g., to change how disabled nodes appear:

```css
.node .fa-ban {
  color: #ccc;
}
```

The css classes needed to overide can be found by inspecting the component via developer tools (chrome/safari/ie) or firebug (firefox). You can also inspect the [source code](/src) or look in [examples](/docs/index.css).

### I do not want the default styles, do I need to fork the project?

Absolutely not! Simply do not import the styles (webpack) or include it in your html (link tags). Roughly, this is the HTML/CSS skeleton rendered by the component:

```pug
div.react-dropdown-tree-select
  div.dropdown
    a.dropdown-trigger
      span
    ul.tag-list
      li.tag-item
        input
    div.dropdown-content
      ul.root
        li.node.tree
          i.toggle.collapsed
          label
            input.checkbox-item
              span.node-label
```

Write your own styles from scratch or copy [existing styles](https://github.com/search?utf8=%E2%9C%93&q=repo%3Adowjones%2Freact-dropdown-tree-select+language%3ACSS+path%3A%2Fsrc&type=Code&ref=advsearch&l=CSS&l=) and tweak them.
Then include your own custom styles in your project.

:bulb: Pro tip: Leverage [node's](#data) `className`, `tagClassName` or [action's](#data) `className` prop to emit your own class name. Then override/add css propeties in your class. Remember that last person wins in CSS (unless specificity or `!important` is involved). Often times, this may suffice and may be easier then writing all the styles from the ground up.

If you believe this aspect can be improved further, feel free to raise an issue.

### My question is not listed here

Find more questions and their answers in the [issue tracker](https://github.com/dowjones/react-dropdown-tree-select/issues?utf8=%E2%9C%93&q=%20label%3Aquestion%20). If it still doesn't answer your questions, please raise an issue.

## Development

Clone the git repo and install dependencies.

```
npm i

// or

yarn install
```

You can then run following scripts for local development

```
npm run demo  // local demo, watches and rebuilds on changes

npm test  // test your changes

npm lint  // fixes anything that can be fixed and reports remaining errors

npm run test:cov  // test coverage
```

**Note:** If your browser doesn't hot reload or reflect changes during `npm run demo`, then delete `docs/bundle.js` and try again. Before submitting final PR, run `npm run build:docs` to build the bundle.js file again.

## License

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

Released 2017 by [Hrusikesh Panda](https://github.com/mrchief) @ [Dow Jones](https://github.com/dowjones)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars0.githubusercontent.com/u/966550?v=4" width="100px;"/><br /><sub><b>toofff</b></sub>](http://www.yanoucrea.fr)<br />[🐛](https://github.com/dowjones/react-dropdown-tree-select/issues?q=author%3Atoofff "Bug reports") [💻](https://github.com/dowjones/react-dropdown-tree-select/commits?author=toofff "Code") [📖](https://github.com/dowjones/react-dropdown-tree-select/commits?author=toofff "Documentation") [🤔](#ideas-toofff "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/1257968?v=4" width="100px;"/><br /><sub><b>Grégory Copin</b></sub>](http://www.les-tilleuls.coop)<br />[🐛](https://github.com/dowjones/react-dropdown-tree-select/issues?q=author%3AGregcop1 "Bug reports") [💻](https://github.com/dowjones/react-dropdown-tree-select/commits?author=Gregcop1 "Code") | [<img src="https://avatars1.githubusercontent.com/u/7589718?v=4" width="100px;"/><br /><sub><b>PRIYANSHU AGRAWAL</b></sub>](https://github.com/priyanshu92)<br />[🐛](https://github.com/dowjones/react-dropdown-tree-select/issues?q=author%3Apriyanshu92 "Bug reports") [💻](https://github.com/dowjones/react-dropdown-tree-select/commits?author=priyanshu92 "Code") [🤔](#ideas-priyanshu92 "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/425261?v=4" width="100px;"/><br /><sub><b>James Greenaway</b></sub>](http://james.greenaway.io)<br />[🐛](https://github.com/dowjones/react-dropdown-tree-select/issues?q=author%3Ajvgreenaway "Bug reports") [💻](https://github.com/dowjones/react-dropdown-tree-select/commits?author=jvgreenaway "Code") [🤔](#ideas-jvgreenaway "Ideas, Planning, & Feedback") | [<img src="https://avatars1.githubusercontent.com/u/36223986?v=4" width="100px;"/><br /><sub><b>itrombitas</b></sub>](https://github.com/itrombitas)<br />[💻](https://github.com/dowjones/react-dropdown-tree-select/commits?author=itrombitas "Code") | [<img src="https://avatars2.githubusercontent.com/u/18341459?v=4" width="100px;"/><br /><sub><b>Dave Henton</b></sub>](https://github.com/davehenton)<br />[🚇](#infra-davehenton "Infrastructure (Hosting, Build-Tools, etc)") | [<img src="https://avatars3.githubusercontent.com/u/4869717?v=4" width="100px;"/><br /><sub><b>Swetha Kolli</b></sub>](https://github.com/nagaskolli)<br />[💻](https://github.com/dowjones/react-dropdown-tree-select/commits?author=nagaskolli "Code") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars1.githubusercontent.com/u/13344028?v=4" width="100px;"/><br /><sub><b>BaarishRain</b></sub>](https://github.com/BaarishRain)<br />[🐛](https://github.com/dowjones/react-dropdown-tree-select/issues?q=author%3ABaarishRain "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/32507174?v=4" width="100px;"/><br /><sub><b>Kovacs Alexandru Robert</b></sub>](http://kovacsalexandrurobert.ro)<br />[🤔](#ideas-akovacspentalog "Ideas, Planning, & Feedback") | [<img src="https://avatars2.githubusercontent.com/u/11201133?v=4" width="100px;"/><br /><sub><b>Alexis Mondragon</b></sub>](https://github.com/amondragon)<br />[🤔](#ideas-amondragon "Ideas, Planning, & Feedback") | [<img src="https://avatars2.githubusercontent.com/u/13438795?v=4" width="100px;"/><br /><sub><b>Charlie91</b></sub>](https://github.com/Charlie91)<br />[🐛](https://github.com/dowjones/react-dropdown-tree-select/issues?q=author%3ACharlie91 "Bug reports") | [<img src="https://avatars3.githubusercontent.com/u/1930681?v=4" width="100px;"/><br /><sub><b>Dhirendrasinh</b></sub>](https://github.com/dhirendrarathod2000)<br />[🐛](https://github.com/dowjones/react-dropdown-tree-select/issues?q=author%3Adhirendrarathod2000 "Bug reports") | [<img src="https://avatars1.githubusercontent.com/u/7006862?v=4" width="100px;"/><br /><sub><b>JKapostins</b></sub>](https://github.com/JKapostins)<br />[🐛](https://github.com/dowjones/react-dropdown-tree-select/issues?q=author%3AJKapostins "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/24354568?v=4" width="100px;"/><br /><sub><b>josvegit</b></sub>](https://github.com/josvegit)<br />[🐛](https://github.com/dowjones/react-dropdown-tree-select/issues?q=author%3Ajosvegit "Bug reports") |
| [<img src="https://avatars1.githubusercontent.com/u/12422912?v=4" width="100px;"/><br /><sub><b>Luis Locon</b></sub>](https://twitter.com/LoconLuis)<br />[🐛](https://github.com/dowjones/react-dropdown-tree-select/issues?q=author%3Aloconluis "Bug reports") | [<img src="https://avatars3.githubusercontent.com/u/10121255?v=4" width="100px;"/><br /><sub><b>Mikdat DOĞRU</b></sub>](https://github.com/mikdatdogru)<br />[🐛](https://github.com/dowjones/react-dropdown-tree-select/issues?q=author%3Amikdatdogru "Bug reports") | [<img src="https://avatars1.githubusercontent.com/u/7553535?v=4" width="100px;"/><br /><sub><b>Will Izard</b></sub>](https://github.com/will-izard)<br />[🤔](#ideas-will-izard "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/4504265?v=4" width="100px;"/><br /><sub><b>Nikola Peric</b></sub>](https://gitlab.com/nikperic)<br />[🐛](https://github.com/dowjones/react-dropdown-tree-select/issues?q=author%3Anikolap "Bug reports") | [<img src="https://avatars2.githubusercontent.com/u/6119839?v=4" width="100px;"/><br /><sub><b>Ramón Alejandro Reyes Fajardo</b></sub>](https://github.com/ramonrf)<br />[🐛](https://github.com/dowjones/react-dropdown-tree-select/issues?q=author%3Aramonrf "Bug reports") | [<img src="https://avatars3.githubusercontent.com/u/10716099?v=4" width="100px;"/><br /><sub><b>Sarada Cherukupalli</b></sub>](https://github.com/sarada-Cheukupalli)<br />[🤔](#ideas-sarada-Cheukupalli "Ideas, Planning, & Feedback") |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
