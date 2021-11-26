const router = require('express').Router()
const userCtrl = require('../controllers/userController')

router.get('/', userCtrl.getAllUser)
router.get('/child', userCtrl.getChildUser)
router.get('/:idUser', userCtrl.getUserById)
router.post('/', userCtrl.createUser)
router.put('/:idUser', userCtrl.updateUserById)
router.delete('/:idUser', userCtrl.deleteUserById)

module.exports = router