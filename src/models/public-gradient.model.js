const { model, Schema } = require("mongoose");

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
  }
})

publicGradientSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const PublicGradient = model('Public-Gradient', publicGradientSchema)

module.exports = PublicGradient