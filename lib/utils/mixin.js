function mixin (dest, src, redefine = true) {
  if (!dest) {
    throw new Error('The dest is required')
  }

  if (!src) {
    throw new Error('The src is required')
  }

  Object.getOwnPropertyNames(src).forEach(function (property) {
    if (!redefine && Object.hasOwnProperty.call(dest, property)) {
      return
    }

    const descriptor = Object.getOwnPropertyDescriptor(src, property)

    Object.defineProperty(dest, property, descriptor)
  })

  return dest
}
