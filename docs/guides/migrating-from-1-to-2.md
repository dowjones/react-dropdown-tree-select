# React Dropdown Tree Select Migration Guide v1 to v2

We've made some changes in the component between the versions which is covered in the following guide

## Action changes

The option to pass a custom onAction handler on node level is now removed. Use the global onAction event instead.

Now, all custom props you pass, such as **myCustomNode** and **myCustomAction**, is also accessible on the event properties. This will make it easier to add generic custom logic based on your custom data/properties which can be used instead of separate handlers.

If you previously passed:

```typescript
{ id: 'mynode' myCustomNode: true, actions: [ { id: 'myaction', myCustomAction: true ... } ... }
```

which you accessed on the onAction event like:

```typescript
onAction = ({ action, id }) => {
  console.log(action, id)
}
```

you can now access the same info with:

```typescript
onAction = (action, node) => {
  console.log(action.id, node.id)
}
```
