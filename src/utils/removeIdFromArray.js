function removeIdFromArray(id, arr) {
  const index = arr.indexOf(id)
  arr.splice(index, 1)
}

module.exports = { removeIdFromArray }