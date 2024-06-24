const ItemSchema = require('../models/Item.model');

exports.addItem = async (req, res, next) => {
    const { name, description, metric, quantity, price, category } = req.body;
    try {
        const { filename } = req.file;
        const seller_id = req.user_id;

        console.log({
            name,
            description,
            seller_id,
            quantity_details: {
                metric,
                quantity
            },
            category,
            price,
            image_file_name: filename
        });

        const item = await ItemSchema.create({
            name,
            description,
            seller_id,
            quantity_details: {
                metric,
                quantity
            },
            category,
            price,
            image_file_name: filename
        });

        res.status(200).json("Item is successfully added!");

    } catch (e) {
        res.status(400).json("Server error, can't add the item");
        console.error(e);
    }
};
