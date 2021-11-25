const Unit = require('../models/Unit')

const getAllUnit = async (req, res) => {
  try {
    let units = await Unit.find({})
    res.status(200).json(units)
  } catch(err) {
    console.log(`Get all unit error: ${err}`)
    res.status(400).json({ message: 'Get error' })
  }
}

const getChildUnit = async (req, res) => {
  let { username } = req.user
  try {
    let unit = await Unit.findOne({ nameOfUnit: username })
    let childUnit = await Unit.find({ idParent: unit._id })
    res.status(200).json(childUnit)
  } catch(err) {
    console.log(`Get child unit error: ${err}`)
    res.status(400).json({ message: 'Get error' })
  }
}

const getUnitById = async (req, res) => {
  let { idUnit } = req.params
  try {
    let unit = await Unit.findById(idUnit)
    res.status(200).json(unit)
  } catch(err) {
    console.log(`Get unit error: ${err}`)
    res.status(400).json({ message: 'Get error' })
  }
}

const createUnit = async (req, res) => {
  let { username } = req.user
  let { nameOfUnit, code } = req.body
  try {
    let parentUnit = await Unit.findOne({ nameOfUnit: username })
    let newUnit = new Unit()
    newUnit.nameOfUnit = nameOfUnit
    newUnit.code = code
    newUnit.idParent = parentUnit._id

    await newUnit.save()
    res.status(200).json(newUnit)

  } catch(err) {
    console.log(`Create unit error: ${err}`)
    res.status(400).json({ message: 'Create error' })
  }
}

const updateUnitById = async (req, res) => {
  let { idUnit } = req.params
  let { nameOfUnit, code } = req.body
  try {
    let updatedUnit = await Unit.findByIdAndUpdate(idUnit, {
      nameOfUnit,
      code
    })
    res.status(200).json(updatedUnit)
  } catch(err) {
    console.log(`Update unit error: ${err}`)
    res.status(400).json({ message: 'Update error' })
  }
}

const deleteUnitById = async (req, res) => {
  let { idUnit } = req.params
  try {
    await Unit.findByIdAndDelete(idUnit)
    res.status(200).json({ message: 'Delete successfully' })
  } catch(err) {
    console.log(`Delete unit error: ${err}`)
    res.status(400).json({ message: 'Delete error' })
  }
}

module.exports = {
  getAllUnit,
  getChildUnit,
  getUnitById,
  createUnit,
  updateUnitById,
  deleteUnitById
}