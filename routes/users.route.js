const usersController = require('../controllers/users.controller')
const express = require('express')
const router = express.Router()
const { validateToken } = require('../middleware/JWT')


router.post('/register', usersController.registerUser)
router.post('/login', usersController.userLogin)
router.get('/validate', validateToken, usersController.validateUser)


module.exports = router