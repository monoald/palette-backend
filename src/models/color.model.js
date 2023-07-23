const { model, Schema } = require("mongoose");

const colorSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
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

colorSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

colorSchema.pre('save', async function (next) {
  const color = this

  if (color.isModified('name')) {
    color.length = getQuantityFromColors(color.colors)
    color.savedCount = 1
    next()
  }

  if (color.isModified('users')) {
    color.savedCount = color.users.length
    next()
  }

  next()
})

const Color = model('Color', colorSchema)

module.exports = Color