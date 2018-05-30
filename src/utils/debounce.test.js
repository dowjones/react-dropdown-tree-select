import test from 'ava'

import debounce from './debounce'

test.cb("calls on leading edge and doesn't call until wait ends", t => {
  t.plan(2)
  const debounced = debounce(() => t.pass(), 50)
  debounced()
  debounced()
  debounced()
  setTimeout(() => {
    t.end()
  }, 70)
})
