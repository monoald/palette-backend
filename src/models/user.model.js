const { model, Schema } = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  palettes: [{
    type: Schema.Types.ObjectId,
    ref: 'Palette'
  }],
  colors: [{
    type: Schema.Types.ObjectId,
    ref: 'Color'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

userSchema.pre('save', async function (next) {
  const user = this
  if (!user.isModified('password')) return next()

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(user.password, salt)

  user.password = hash
  next()
})

const User = model('User', userSchema)

module.exports = User