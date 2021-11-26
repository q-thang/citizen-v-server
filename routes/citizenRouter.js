const router = require('express').Router()
const citizenCtrl = require('../controllers/citizenController')

router.get('/', citizenCtrl.getAllCitizen)
router.get('/:idcitizen', citizenCtrl.getCitizenById)
router.post('/', citizenCtrl.createCitizen)
router.put('/:idcitizen', citizenCtrl.updateCitizenById)
router.delete('/:idcitizen', citizenCtrl.deleteCitizenById)

module.exports = router