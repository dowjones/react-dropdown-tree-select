// tslint:disable:interface-name
declare module 'react-dropdown-tree-select' {
  import * as React from 'react'

  export type TreeData = Object | TreeNodeProps[]

  export type Mode = 'multiSelect' | 'simpleSelect' | 'radioSelect' | 'hierarchical'

  export type ShowDropdownState = 'default' | 'initial' | 'always'

  export interface DropdownTreeSelectProps {
    data: TreeData
    /** Clear the input search if a node has been selected/unselected */
    clearSearchOnChange?: boolean
    /** Displays search results as a tree instead of flattened results */
    keepTreeOnSearch?: boolean
    /** Displays children of found nodes to allow searching for a parent node on
     * then selecting any child node of the found node. Defaults to false
     * NOTE this works only in combination with keepTreeOnSearch
     */
    keepChildrenOnSearch?: boolean
    /** Keeps single selects open after selection. Defaults to `false`
     * NOTE this works only in combination with simpleSelect or radioSelect
     */
    keepOpenOnSelect?: boolean
    /** Texts to override output for */
    texts?: TextProps
    /** If set to initial, shows the dropdown when first rendered.
     * If set to always, shows the dropdown when rendered, and keeps it visible at all times. Toggling dropdown is disabled.
     */
    showDropdown?: ShowDropdownState
    /** Additional classname for container.
     * The container renders with a default classname of react-dropdown-tree-select
     */
    className?: string
    /** Fires when a node change event occurs. Currently the following actions trigger a node change:
     * Checkbox click which checks/unchecks the item
     * Closing of pill (which unchecks the corresponding checkbox item)
     *
     * Calls the handler with the current node object and all selected nodes (if any)
     */
    onChange?: (currentNode: TreeNode, selectedNodes: TreeNode[]) => void
    /**  Fired on click of the action */
    onAction?: (currentNode: TreeNode, currentAction: NodeAction) => void
    /** Fires when a node is expanded or collapsed.
     * Calls the handler with the current node object
     */
    onNodeToggle?: (currentNode: TreeNode) => void
    /** Fires when input box receives focus or the dropdown arrow is clicked.
     * This is helpful for setting dirty or touched flags with forms
     */
    onFocus?: () => void
    /** Fires when input box loses focus or the dropdown arrow is clicked again (and the dropdown collapses).
     * This is helpful for setting dirty or touched flags with forms
     */
    onBlur?: () => void
    /** Defines how the dropdown is rendered / behaves
         *
         * - multiSelect
         * A multi selectable dropdown which supports tree data with parent-child relationships. This is the default mode.
         *
         * - hierarchical
         * A multi selectable dropdown which supports tree data **without** parent-child relationships. In this mode, selecting a node has no ripple effects on its descendants or ancestors. Subsequently, `showPartiallySelected` becomes a moot flag and has no effect as well.
         *
         * ⚠️ Note that `hierarchical=true` negates/overrides `showPartiallySelected`.
         *
         * - simpleSelect
         * Turns the dropdown into a simple, single select dropdown. If you pass tree data, only immediate children are picked, grandchildren nodes are ignored.
         *
         * ⚠️ If multiple nodes in data are selected - by setting either `checked` or `isDefaultValue`, only the first visited node stays selected.
         *
         * - radioSelect
         * Turns the dropdown into radio select dropdown.

         * Like `simpleSelect`, you can only select one value; but keeps the tree/children structure.
         *
         * ⚠️ If multiple nodes in data are selected - by setting either `checked` or `isDefaultValue`, only the first visited node stays selected.
         *
         *
         * */
    mode?: Mode
    /** If set to true, shows checkboxes in a partial state when one, but not all of their children are selected.
     * Allows styling of partially selected nodes as well, by using :indeterminate pseudo class.
     * Simply add desired styles to .node.partial .checkbox-item:indeterminate { ... } in your CSS
     */
    showPartiallySelected?: boolean
    /** disabled=true disables the dropdown completely. This is useful during form submit events */
    disabled?: boolean
    /** readOnly=true makes the dropdown read only,
     * which means that the user can still interact with it but cannot change any of its values.
     * This can be useful for display only forms
     */
    readOnly?: boolean
    /** Specific id for container. The container renders with a default id of `rdtsN` where N is count of the current component rendered
     * Use to ensure a own unique id when a simple counter is not sufficient, e.g in a partial server render (SSR)
     */
    id?: string
    /** Optional search predicate to override the default case insensitive contains match on node labels. */
    searchPredicate?: (currentNode: TreeNode, searchTerm: string) => boolean
    /** inlineSearchInput=true Makes the search input renders inside the dropdown-content. Defaults to `false` */
    inlineSearchInput?: boolean
  }

  export interface DropdownTreeSelectState {
    showDropdown: ShowDropdownState
    searchModeOn: boolean
    allNodesHidden: boolean
    tree: TreeNode[]
    tags: TreeNode[]
  }

  export default class DropdownTreeSelect extends React.Component<DropdownTreeSelectProps, DropdownTreeSelectState> {
    node: HTMLDivElement
    searchInput: HTMLInputElement
    keepDropdownActive: boolean
    handleClick(): void
  }

  export interface TreeNode {
    /** Checkbox label */
    label: string
    /** Checkbox value */
    value: string
    /** Initial state of checkbox. if true, checkbox is selected and corresponding pill is rendered. */
    checked?: boolean
    /** Selectable state of checkbox. if true, the checkbox is disabled and the node is not selectable. */
    disabled?: boolean
    /** If true, the node is expanded
     * (children of children nodes are not expanded by default unless children nodes also have expanded: true).
     */
    expanded?: boolean
    /** Additional css class for the node. This is helpful to style the nodes your way */
    className?: string
    /** Css class for the corresponding tag. Use this to add custom style the pill corresponding to the node. */
    tagClassName?: string
    /** An array of extra action on the node (such as displaying an info icon or any custom icons/elements) */
    actions?: NodeAction[]
    /** Allows data-* attributes to be set on the node and tag elements */
    dataset?: NodeDataSet
    /** Indicate if a node is a default value.
     * When true, the dropdown will automatically select the node(s) when there is no other selected node.
     * Can be used on more than one node.
     */
    isDefaultValue?: boolean
    /** Any extra properties that you'd like to receive during `onChange` event */
    [property: string]: any
  }

  export interface TreeNodeProps extends TreeNode {
    /** Array of child objects */
    children?: TreeNode[]
  }

  export interface TextProps {
    /** The text to display as placeholder on the search box. Defaults to Choose... */
    placeholder?: string
    /** The text to display when the search does not find results in the content list. Defaults to No matches found */
    noMatches?: string
    /** Adds `aria-labelledby` to search input when input starts with `#`, adds `aria-label` to search input when label has value (not containing '#') */
    label?: string
    /** The text to display for `aria-label` on tag delete buttons which is combined with `aria-labelledby` pointing to the node label. Defaults to `Remove */
    labelRemove?: string
  }

  export interface NodeAction {
    /** CSS class for the node. e.g. `fa fa-info` */
    className: string
    /** HTML tooltip text */
    title?: string
    /** Any text to be displayed. This is helpful to pass ligatures if you're using ligature fonts */
    text?: string
    /** Any extra properties that you'd like to receive during `onChange` event */
    [property: string]: any
  }

  export interface NodeDataSet {
    [property: string]: any
  }
}
