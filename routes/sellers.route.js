const express = require('express')
const router = express.Router()
const { validateToken } = require('../middleware/JWT')
const sellerController = require("../controllers/sellers.controller")

const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/user_images')
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname) // rename file name
    }
})

const upload = multer({ storage: storage })


router.use(validateToken)

router.post('/addItems', upload.single('file'), sellerController.addItem)
router.get('/get-all-transactions', sellerController.allTransactions)
router.delete('/reject-order-request', sellerController.rejectOrderRequest)
router.get('/get-items', sellerController.getItems)
router.delete('/delete-item', sellerController.deleteItem)
router.put('/update-item', upload.single('file'), sellerController.updateItem)
router.get('/get-current-prices', sellerController.currentPrices)
router.put('/accept-order-request', sellerController.acceptRequest)

module.exports = router