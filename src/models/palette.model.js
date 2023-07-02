const { model, Schema } = require('mongoose')
const { getQuantityFromColors } = require('../utils/getQuantityFromColors')

const paletteSchema = new Schema({
  colors: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  length: {
    type: Number
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  savedCount: {
    type: Number
  }
})

paletteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

paletteSchema.pre('save', async function (next) {
  const palette = this

  if (palette.isModified('colors')) {
    palette.length = getQuantityFromColors(palette.colors)
    palette.savedCount = 1
    next()
  }

  if (palette.isModified('users')) {
    palette.savedCount = palette.users.length
    next()
  }

  next()
})

const Palette = model('Palette', paletteSchema)

module.exports = Palette