const ItemSchema = require('../models/Item.model');
const TransactionSchema = require("../models/Transaction.model")
const getImage = require("../utils/getImage")
const UserSchema = require("../models/User.model")

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


exports.allTransactions = async (req, res) => {
    const sellerID = req.query.sellerID;

    try {
        const transactions = await TransactionSchema.find({ "sellerID": sellerID });

        const transactions_with_extra_data = await Promise.all(transactions.map(async (transaction) => {
            const transactionObj = transaction.toObject();
            const item = await ItemSchema.findOne({ "_id": transactionObj.itemID });
            const image = getImage(item.image_file_name);
            const userObj = await UserSchema.findOne({ "_id": transactionObj.buyerID })
            const buyerName = `${userObj.firstName} ${userObj.lastName}`

            return {
                transactionID: transactionObj._id,
                item_name: item.name,
                image: image,
                quantity: transactionObj.requested_quantity,
                amount: transactionObj.amount,
                status: transactionObj.status,
                created_date: transactionObj.createdAt,
                buyerName: buyerName,
                buyerID: transactionObj.buyerID
            };
        }));


        res.status(200).json(transactions_with_extra_data);
    } catch (e) {
        console.error(e)
        res.status(404).json({ message: "can't retrieve transaction data now!" });
    }
}


exports.rejectOrderRequest = async (req, res) => {
    const transactionID = req.query.transactionID

    try {
        await TransactionSchema.deleteOne({ "_id": transactionID })

        res.status(200).json({ message: "sucessfully deleted order!" })
    } catch (e) {
        res.status(400).json({ message: "cant deleted order!" })
    }
}