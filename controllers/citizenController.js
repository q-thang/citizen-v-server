const Citizen = require('../models/Citizen')

const getAllCitizen = async (req, res) => {
  try {
    let citizens = await Citizen.find({})
    res.status(200).json(citizens)
  } catch(err) {
    console.log(`Get all citizen error: ${err}`)
    res.status(400).json({ message: 'Get error' })
  }
}

const getCitizenById = async (req, res) => {
  let { idCitizen } = req.params
  try {
    let citizen = await Citizen.findById(idCitizen)
    res.status(200).json(citizen)
  } catch(err) {
    console.log(`Get citizen error: ${err}`)
    res.status(400).json({ message: 'Get error' })
  }
}

const createCitizen = async (req, res) => {
  let { fullName, dateOfBirth, currentAddress, gender, phoneNumber,
    identifiedCode, occupation, ethnic, religion, idUnit
  } = req.body
  try {
    let newCitizen = new Citizen()
    newCitizen.fullName = fullName
    newCitizen.dateOfBirth = dateOfBirth
    newCitizen.currentAddress = currentAddress
    newCitizen.gender = gender
    newCitizen.phoneNumber = phoneNumber
    newCitizen.identifiedCode = identifiedCode
    newCitizen.occupation = occupation
    newCitizen.ethnic = ethnic
    newCitizen.religion = religion
    newCitizen.idUnit = idUnit

    await newCitizen.save()
    res.status(200).json(newCitizen)

  } catch(err) {
    console.log(`Create citizen error: ${err}`)
    res.status(400).json({ message: 'Create error' })
  }
}

const updateCitizenById = async (req, res) => {
  let { idCitizen } = req.params
  let { fullName, dateOfBirth, currentAddress, gender, phoneNumber,
    identifiedCode, occupation, ethnic, religion, idUnit
  } = req.body
  try {
    let dataCitizen = {}
    if (fullName) dataCitizen['fullName'] = fullName
    if (dateOfBirth) dataCitizen['dateOfBirth'] = dateOfBirth
    if (currentAddress) dataCitizen['currentAddress'] = currentAddress
    if (gender) dataCitizen['gender'] = gender
    if (phoneNumber) dataCitizen['phoneNumber'] = phoneNumber
    if (identifiedCode) dataCitizen['identifiedCode'] = identifiedCode
    if (occupation) dataCitizen['occupation'] = occupation
    if (ethnic) dataCitizen['ethnic'] = ethnic
    if (religion) dataCitizen['religion'] = religion
    if (idUnit) dataCitizen['idUnit'] = idUnit

    let updatedCitizen = await Citizen.findByIdAndUpdate(idCitizen, dataCitizen)
    res.status(200).json(updatedCitizen)

  } catch(err) {
    console.log(`Update citizen error: ${err}`)
    res.status(400).json({ message: 'Update error' })
  }
}

const deleteCitizenById = async (req, res) => {
  let { idCitizen } = req.params
  try {
    await Citizen.findByIdAndDelete(idCitizen)
    res.status(200).json({ message: 'Delete successfully' })
  } catch(err) {
    console.log(`Delete citizen error: ${err}`)
    res.status(400).json({ message: 'Delete error' })
  }
}

module.exports = {
  getAllCitizen,
  getCitizenById,
  createCitizen,
  updateCitizenById,
  deleteCitizenById
}