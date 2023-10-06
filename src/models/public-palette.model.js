const { model, Schema } = require('mongoose')
const { getQuantityFromColors } = require('../utils/getQuantityFromColors')

const publicPaletteSchema = new Schema({
  colors: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  length: {
    type: Number,
    required: true
  },
  upId: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  savedCount: {
    type: Number
  }
}) 

publicPaletteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

publicPaletteSchema.pre('save', async function (next) {
  const palette = this

  if (palette.isModified('colors')) {
    palette.savedCount = 1
    next()
  }

  if (palette.isModified('users')) {
    palette.savedCount = palette.users.length
    next()
  }

  next()
})

const PublicPalette = model('Public-Palette', publicPaletteSchema)

module.exports = PublicPalette