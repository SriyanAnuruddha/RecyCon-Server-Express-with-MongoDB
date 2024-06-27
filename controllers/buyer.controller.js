const ItemSchema = require("../models/Item.model")
const fs = require('fs')
const path = require('path')

exports.searchItems = (req, res) => {
    res.status(200).json("items")
}

exports.newItems = async (req, res) => {
    try {
        const items = await ItemSchema.find().sort({ "createdAt": -1 })


        const itemsWithImages = items.map(item => {
            const itemObj = item.toObject()
            const imagePath = path.join(__dirname, '../images/user_images', item.image_file_name);

            // Check if image exists
            if (!fs.existsSync(imagePath)) {
                return res.status(404).json({ message: 'Image not found' });
            }

            // Read image file and convert to base64
            const image = fs.readFileSync(imagePath);
            const base64Image = Buffer.from(image).toString('base64');

            return (
                { ...itemObj, image_file_name: base64Image }
            )
        })


        res.status(200).json(itemsWithImages)

    } catch (e) {
        console.log(e)
        res.status(400).json("can't get new items server error")
    }
}