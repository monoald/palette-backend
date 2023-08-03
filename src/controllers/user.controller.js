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
    res.cookie('user', result.user)
    res.cookie('token', result.token)
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
    const { id: idFromParams } = req.params
    const { userId: idFromToken } = req
    const user = await service.findOne(idFromParams, idFromToken)
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