const express = require('express')
const router = express.Router()
const { validateToken } = require('../middleware/JWT')
const buyerController = require("../controllers/buyer.controller")

router.use(validateToken)

router.get('/search-items', buyerController.searchItems)
router.get('/new-items', buyerController.newItems)
router.get('/filtered-items', buyerController.filteredItems)

module.exports = router