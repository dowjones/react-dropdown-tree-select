import partial from 'array.partial'

const identity = c => c

export default (node, childProp = 'children', childSelector = identity) => {
  if (partial(node[childProp], c => childSelector(c).checked)) return true
  return node[childProp].some(c => childSelector(c).partial)
}
