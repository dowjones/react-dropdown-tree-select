import partial from 'array.partial'

const identity = c => c

export default (node, childProp = 'children', childSelector = identity) =>
  partial(node[childProp], c => childSelector(c).expanded)
