const getChildRegency = (regency) => {
  let newRegency = null
  switch (regency) {
    case 'A1':
      newRegency = 'A2'
      break
    case 'A2':
      newRegency = 'A3'
      break
    case 'A3':
      newRegency = 'B1'
      break
    case 'B1':
      newRegency = 'B2'
      break
    default:
      newRegency = 'A1'
      break
  }
  return newRegency
}

module.exports = {
  getChildRegency
}