const { error } = require("console")
const ItemSchema = require("../models/Item.model")
const fs = require('fs')
const path = require('path')

function getImage(image_file_name) {
    const imagePath = path.join(__dirname, '../images/user_images', image_file_name);

    // Check if image exists
    if (!fs.existsSync(imagePath)) {
        console.log("image path is wrong!")
    }

    // Read image file and convert to base64
    const image = fs.readFileSync(imagePath);
    const base64Image = Buffer.from(image).toString('base64');

    return base64Image
}


exports.searchItems = (req, res) => {
    res.status(200).json("items")
}

exports.newItems = async (req, res) => {
    try {
        const items = await ItemSchema.find().sort({ "createdAt": -1 })

        const itemsWithImages = items.map(item => {
            const itemObj = item.toObject()
            const image = getImage(item.image_file_name)
            return (
                { ...itemObj, image_file_name: image }
            )
        })

        res.status(200).json(itemsWithImages)

    } catch (e) {
        res.status(404).json("server error: can't get new items from server")
    }
}

exports.filteredItems = async (req, res) => {
    const category = req.query.category
    const itemName = req.query.itemName

    if (!category && !itemName) {
        res.status(400).json({ message: "please select a category or enter item name" })
    }

    try {
        const query = {};
        if (category) {
            query.category = category;
        }

        if (itemName) {
            query.name = { $regex: itemName, $options: 'i' }; // Text search
        }

        const items = await ItemSchema.find(query);

        const itemsWithImages = items.map(item => {
            const itemObj = item.toObject()
            const image = getImage(item.image_file_name)
            return (
                { ...itemObj, image_file_name: image }
            )
        })

        return res.status(200).json(itemsWithImages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.getItem = async (req, res) => {
    const itemID = req.query.itemID

    const item = await ItemSchema.findOne({ "_id": itemID })

    if (item) {
        const itemObj = item.toObject()
        const image = getImage(item.image_file_name)
        const itemWithImage = { ...itemObj, image_file_name: image }

        res.status(200).json(itemWithImage)
    } else {
        res.status(404).json({ message: "can't find the item" })
    }
}