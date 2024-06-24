const mongoose = require('mongoose')

const ItemSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter item name"]
        },
        description: {
            type: String,
            required: [true, "Please enter description "]
        },
        seller_id: {
            type: String,
            required: [true, "Please enter seller_id"]
        },
        quantity_details: {
            metric: {
                type: String,
                required: [true, "Please enter metric"]
            },
            quantity: {
                type: Number,
                required: [true, "Please enter quantity"]
            }
        },
        category: {
            type: String,
            required: [true, "Please enter category"]
        },
        price: {
            type: Number,
            required: [true, "Please enter price"]
        },
        image_file_name: {
            type: String,
            required: [true, "Please enter image_file_name"]
        }
    },
    {
        timestamps: true
    }
)

const Item = mongoose.model('Item', ItemSchema)

module.exports = Item