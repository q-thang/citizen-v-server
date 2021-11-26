const User = require('../models/User')
const bcript = require('bcrypt')
const { getChildRegency } = require('../functions')

const getAllUser = async (req, res) => {
  try {
    let users = await User.find({})
    users = users.map(u => ({ ...u._doc, password: null }))
    res.status(200).json(users)
  } catch(err) {
    console.log(`Get all user error: ${err}`)
    res.status(400).json({ message: 'Get error' })
  }
}

const getChildUser = async (req, res) => {
  let { username, regency } = req.user
  try {
    let childRegency = getChildRegency(regency)
    let users = await User.find({ username: { $regex: username + '.*' }, regency: childRegency })
    users = users.map(u => ({ ...u._doc, password: null }))
    res.status(200).json(users)
  } catch(err) {
    console.log(`Get child user error: ${err}`)
    res.status(400).json({ message: 'Get error' })
  }
}

const getUserById = async (req, res) => {
  let { idUser } = req.params
  try {
    let user = await User.findById(idUser)
    res.status(200).json(user)
  } catch(err) {
    console.log(`Get user error: ${err}`)
    res.status(400).json({ message: 'Invalid Id user!' })
  }
}

const createUser = async (req, res) => {
  let { username, password } = req.body
  let { regency } = req.user
  try {
    let newRegency = getChildRegency(regency)

    if (username && password) {
      let checkName = await User.findOne({ username })
      if (checkName) {
        return res.status(400).json({ message: 'Username exists!' })
      }
      password = await bcript.hash(password, 10)
      let newUser = new User()
      newUser.username = username
      newUser.password = password
      newUser.regency = newRegency
      newUser.active = true
      await newUser.save()
      res.status(200).json({
        ...newUser._doc,
        password: null
      })
    }

  } catch(err) {
    console.log(`Create user error: ${err}`)
    res.status(400).json({ message: 'Create error' })
  }
}

const updateUserById = async (req, res) => {
  let { idUser } = req.params
  let { newUsername, newPassword, active } = req.body
  try {
    newPassword = await bcript.hash(newPassword, 10)
    let dataUser = {
      username: newUsername,
      password: newPassword,
      active
    }
    let updatedUser = await User.findByIdAndUpdate(idUser, dataUser)
    res.status(200).json(updatedUser)
  } catch(err) {
    console.log(`Update user error: ${err}`)
    res.status(400).json({ message: 'Update error' })
  }
}

const deleteUserById = async (req, res) => {
  let { idUser } = req.params
  try {
    await User.findByIdAndDelete(idUser)
    res.status(200).json({ message: 'Delete successfully!' })
  } catch(err) {
    console.log(`Delete user error: ${err}`)
    res.status(400).json({ message: 'Invalid Id user!' })
  }
}

module.exports = {
  getAllUser,
  getChildUser,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
}