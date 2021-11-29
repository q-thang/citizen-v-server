const router = require('express').Router()
const userCtrl = require('../controllers/userController')

router.get('/user', userCtrl.getAllUser)
router.get('/user/child', userCtrl.getChildUser)
router.get('/user/:idUser', userCtrl.getUserById)
router.post('/user', userCtrl.createUser)
router.put('/user/:idUser', userCtrl.updateUserById)
router.delete('/user/:idUser', userCtrl.deleteUserById)

module.exports = router