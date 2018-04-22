const noop = () => {}
const createEventMock = ({ stopPropagationSpy = noop, stopImmediatePropagationSpy = noop } = {}) => ({
  stopPropagation: stopPropagationSpy,
  nativeEvent: { stopImmediatePropagation: stopImmediatePropagationSpy }
})

export default createEventMock
