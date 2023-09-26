const { model, Schema } = require("mongoose");

const gradientAnimationSchema = new Schema({
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

gradientAnimationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

gradientAnimationSchema.pre('save', async function (next) {
  const gradientAnimation = this

  if (gradientAnimation.isModified('users')) {
    gradientAnimation.savedCount = gradientAnimation.users.length
    next()
  }

  next()
})

const GradientAnimation = model('Gradient-Animation', gradientAnimationSchema)

module.exports = GradientAnimation