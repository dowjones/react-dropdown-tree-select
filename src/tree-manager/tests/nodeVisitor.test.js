import test from 'ava'
import nodeVisitor from '../nodeVisitor'

test('should return empty array if no tree is provided', t => {
  const nodes = nodeVisitor.getNodesMatching(undefined)
  t.true(nodes.length === 0)
})
