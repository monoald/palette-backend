const { model, Schema } = require('mongoose');

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
  upId: {
    type: String,
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

const Gradient = model('Gradient', gradientSchema)

module.exports = Gradient