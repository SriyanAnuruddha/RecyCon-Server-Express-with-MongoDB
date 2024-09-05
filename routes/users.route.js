const usersController = require('../controllers/users.controller')
const express = require('express')
const router = express.Router()
const { validateToken } = require('../middleware/JWT')


router.post('/register', usersController.registerUser)
router.post('/login', usersController.userLogin)
router.get('/validate', validateToken, usersController.validateUser)
router.get('/get-user-details', validateToken, usersController.getUserDetails)
router.put('/update-user-details', validateToken, usersController.updateUserDetails)

module.exports = router