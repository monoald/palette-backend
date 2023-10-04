const { model, Schema } = require("mongoose");

const gradientSchema = new Schema({
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
  },
  upId: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  }
})

gradientSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

gradientSchema.pre('save', async function (next) {
  const gradient = this

  if (gradient.isModified('users')) {
    gradient.savedCount = gradient.users.length
    next()
  }

  next()
})

const Gradient = model('Gradient', gradientSchema)

module.exports = Gradient