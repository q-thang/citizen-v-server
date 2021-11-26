const router = require('express').Router()
const unitCtrl = require('../controllers/unitController')

router.get('/', unitCtrl.getAllUnit)
router.get('/child', unitCtrl.getChildUnit)
router.get('/:idUnit', unitCtrl.getUnitById)
router.post('/', unitCtrl.createUnit)
router.put('/:idUnit', unitCtrl.updateUnitById)
router.delete('/:idUnit', unitCtrl.deleteUnitById)

module.exports = router