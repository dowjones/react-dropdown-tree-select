/**
 * Represents a tree node (not DOM node) in the data tree.
 * It can have the following properties:
 *
 * id               {string|optional}           User defined id, comes from `data` passed to the component.
 * _id              {string}                    Internal id, auto generated if `id` is not defined, otherwise set to `id`.
 * rootPrefixId     {string}                    The id of the component's instance.
 * parent           {Node}                      Parent node, if a child.
 * label            {string|required}           Checkbox label
 * value            {string|required}           Checkbox value
 * children         {array<node>|optional}      Array of child nodes
 * checked          {bool|optional}             Initial state of checkbox. if true, checkbox is selected and corresponding pill is rendered.
 * disabled         {bool|optional}             Selectable state of checkbox. if true, the checkbox is disabled and the node is not selectable.
 * expanded         {bool|optional}             If true, the node is expanded (children of children nodes are not expanded by default unless children nodes also have expanded: true).
 * className        {string|optional}           Additional css class for the node. This is helpful to style the nodes your way
 * tagClassName     {string|optional}           Css class for the corresponding tag. Use this to add custom style the pill corresponding to the node.
 * actions          {array<object>|optional}    An array of extra action on the node (such as displaying an info icon or any custom icons/elements)
 * dataset          {object|optional}           Allows data-* attributes to be set on the node and tag elements
 * isDefaultValue   {bool|optional}             Indicate if a node is a default value. When true, the dropdown will automatically select the node(s) when there is no other selected node. Can be used on more than one node.
 *
 */
export default class Node {
  constructor({ depth, rootPrefixId, parent, index, ...dataProps }) {
    // first copy all props coming from data
    Object.assign(this, dataProps)

    // then assign basic ones
    this._depth = depth
    this.rootPrefixId = rootPrefixId

    if (parent) {
      this._id = this.id || `${parent._id}-${index}`
      this._parent = parent._id
      parent._children.push(this._id)
    } else {
      this._id = this.id || `${rootPrefixId ? `${rootPrefixId}-${index}` : index}`
    }
  }

  /**
   * Given an element, generate a DOM Id that's unique across instances
   */
  getDOMId = element => {
    // if user has defined id, then ensure it's unique across instances
    if (this.id) return `${this.rootPrefixId}_${this.id}_${element}`
    return `${this._id}_${element}`
  }
}
