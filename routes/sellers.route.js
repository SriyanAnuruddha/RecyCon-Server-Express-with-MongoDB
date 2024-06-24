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


module.exports = router