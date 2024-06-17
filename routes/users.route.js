const usersRoute = require('../controllers/users.controller')
const express = require('express')
const router = express.Router()

router.post('/', usersRoute.insertUser)


module.exports = router