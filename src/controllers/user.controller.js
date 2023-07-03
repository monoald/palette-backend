const UserService = require('../service/user.service')

const service = new UserService

const signUp = async (req, res, next) => {
  try {
    const newUser = await service.create(req.body)
    res.status(201).json(newUser)
  } catch (error) {
    next(error)
  }
}

const signIn = async (req, res, next) => {
  try {
    const result = await service.signIn(req.body)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const getUsers = async (req, res, next) => {
  try {
    const users = await service.find()
    res.json(users)
  } catch (error) {
    next(error)
  }
}

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await service.findOne(id)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { email } = req.params
    const data = req.body
    const user = await service.update(email, data)
    res.json(user)
  } catch(error) {
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { email } = req.params
    await service.delete(email)
    res.status(201).json({ email })
  } catch (error) {
    next(error)
  }
}

module.exports = { signUp, signIn, getUsers, getUser, updateUser, deleteUser }