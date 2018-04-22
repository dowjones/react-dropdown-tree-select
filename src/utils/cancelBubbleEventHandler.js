export default handler => e => {
  e.stopPropagation()
  e.nativeEvent.stopImmediatePropagation()
  handler(e)
}
