const { model, Schema } = require("mongoose");

const iconSchema = new Schema({
  name: {
    type: String,
    // unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  icons: [{
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    unicode: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    color: {
      type: String,
      lowercase: true,
    }
  }],
  color: {
    type: String,
    lowercase: true,
    trim: true
  },
  svgFont: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true,
  },
  fonts: {
    type: String,
    required: true
  },
  iconsZip: {
    type: String,
    required: true
  },
  savedCount: {
    type: Number
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
})

iconSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

iconSchema.pre('save', async function (next) {
  const gradient = this

  if (gradient.isModified('users')) {
    gradient.savedCount = gradient.users.length
    next()
  }

  next()
})

const Icon = model('Icon', iconSchema)

module.exports = Icon