# Migrating from v1 to v2

We've made some changes in the component between the versions which is covered in the following guide.

## Action Changes

- The option to pass a local `onAction` handler on a node is now removed. Use the **global** `onAction` event instead.

  ```jsx
  <DropdownTreeSelect onAction={onAction} ... />
  ```

- `onAction` signature is now consistent with signature for other event handlers such `onChange` and `onNodeToggle`

  ```js
  // before
  onAction = ({ action, id }) => {
    console.log(action, id)
  }

  // after
  onAction = (node, action) => {
    console.log(action, node.id)
  }
  ```

- Any custom props passed to `node` or `action` is accessible in the event properties. This will make it easier to add generic custom logic based on your custom data/properties which can be used instead of separate handlers.

  For example:

  ```js
  // node with action and custom props
  {
    id: 'mynode',
    propA: 'hello',
    propB: true,
    actions: [
      {
        id: 'myaction',
        propX: {...},
        propY: 12
      }
    ]
  }

  onAction = (node, action) => {
    console.log(node.propA, node.propB, action.propX, action.propY)
    // prints hello true {...} 12
  }

  ```
