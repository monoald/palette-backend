const { model, Schema } = require('mongoose')
const bcrypt = require('bcrypt')

const passportLocalMongoose = require('passport-local-mongoose')
const findOrCreate = require('mongoose-findorcreate')
const { SECRET } = require('../config/config')
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 60,
  },
  name: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  avatar: String,
  provider: {
    type: String,
  },
  signInKey: {
    type: String,
    unique: true,
    minlength: 20,
    maxlength: 20
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true,
  },
  palettes: [{
    type: Schema.Types.ObjectId,
    ref: 'Palette'
  }],
  colors: [{
    type: Schema.Types.ObjectId,
    ref: 'Color'
  }],
})

userSchema.plugin(passportLocalMongoose)

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

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      provider: this.provider,
      email: this.email,
      id: this.id
    },
    SECRET,
    { expiresIn: '60d' },
  );
  return token;
};

const User = model('User', userSchema)

module.exports = User