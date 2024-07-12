const express = require('express')
const router = express.Router()
const { validateToken } = require('../middleware/JWT')
const buyerController = require("../controllers/buyer.controller")

router.use(validateToken)

router.get('/search-items', buyerController.searchItems)
router.get('/new-items', buyerController.newItems)
router.get('/filtered-items', buyerController.filteredItems)
router.get('/get-item', buyerController.getItem)
router.post('/new-transaction', buyerController.newTransaction)
router.get('/get-all-transactions', buyerController.allTransactions)
router.delete('/cancel-order', buyerController.cancelOrder)

module.exports = router