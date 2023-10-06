const { model, Schema } = require('mongoose');

const publicGradientSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
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

publicGradientSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

publicGradientSchema.pre('save', async function (next) {
  const gradient = this

  if (gradient.isModified('name')) {
    gradient.savedCount = 1
    next()
  }

  if (gradient.isModified('users')) {
    gradient.savedCount = gradient.users.length
    next()
  }

  next()
})

const PublicGradient = model('Public-Gradient', publicGradientSchema)

module.exports = PublicGradient