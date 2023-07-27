const { Router } = require('express')

const { signIn, signUp, getUsers, getUser, updateUser, deleteUser } = require('../controllers/user.controller')
const { validatorHandler } = require('../middlewares/validator.handler')
const { createUserSchema, getUserSchema, updateUserSchema, signInSchema } = require('../schemas/user.schema')

const User = require('../models/user.model')
const passport = require('passport')

const router = Router()

router.get('/',
  getUsers
)

router.get('/:id',
  validatorHandler(getUserSchema, 'params'),
  getUser
)

router.patch('/:id',
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  updateUser
)

router.delete('/:id',
  validatorHandler(getUserSchema, 'params'),
  deleteUser
)

router.post(
  '/signup',
  validatorHandler(createUserSchema, 'body'),
  signUp
)

router.post('/signin',
  validatorHandler(signInSchema, 'body'),
  signIn
)

const requireJwtAuth = passport.authenticate('jwt', { session: false });

router.put('/:id', [requireJwtAuth], async (req, res, next) => {
  try {
    const tempUser = await User.findById(req.params.id);
    if (!tempUser) return res.status(404).json({ message: 'No such user.' });
    if (!(tempUser.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'You do not have privileges to edit this user.' });

    //validate name, username and password
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    let avatarPath = null;
    if (req.file) {
      avatarPath = req.file.filename;
    }

    // if fb or google user provider dont update password
    let password = null;
    if (req.user.provider === 'email' && req.body.password && req.body.password !== '') {
      password = await hashPassword(req.body.password);
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser && existingUser.id !== tempUser.id) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    const updatedUser = { avatar: avatarPath, name: req.body.name, username: req.body.username, password };
    // remove '', null, undefined
    Object.keys(updatedUser).forEach((k) => !updatedUser[k] && updatedUser[k] !== undefined && delete updatedUser[k]);
    // console.log(req.body, updatedUser);
    const user = await User.findByIdAndUpdate(tempUser.id, { $set: updatedUser }, { new: true });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

module.exports = router