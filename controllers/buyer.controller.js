const { error } = require("console")
const ItemSchema = require("../models/Item.model")
const fs = require('fs')
const path = require('path')
const TransactionSchema = require("../models/Transaction.model")
const getImage = require("../utils/getImage")


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

exports.newTransaction = async (req, res) => {
    const sellerID = req.body.sellerID
    const buyerID = req.body.buyerID
    const itemID = req.body.itemID
    const requested_quantity = req.body.requested_quantity
    const amount = req.body.amount

    try {
        if (!sellerID) {
            return res.status(400).json({ message: "sellerID is missing" })
        } else if (!buyerID) {
            return res.status(400).json({ message: "buyerID is missing" })
        } else if (!itemID) {
            return res.status(400).json({ message: "itemID is missing" })
        } else if (!requested_quantity) {
            return res.status(400).json({ message: "requested_quantity is missing" })
        } else if (!amount) {
            return res.status(400).json({ message: "amount is missing" })
        }
        const Transaction = await TransactionSchema.create({
            sellerID,
            buyerID,
            itemID,
            requested_quantity,
            amount,
            status: "pending"
        })

        return res.status(200).json("transacton is requested!");

    } catch (e) {
        console.error(e)
        return res.status(400).json({ message: "server error: can't request a transaction now!" })
    }
}


exports.allTransactions = async (req, res) => {
    const buyerID = req.query.buyerID;

    try {
        const transactions = await TransactionSchema.find({ "buyerID": buyerID });

        const transactions_with_extra_data = await Promise.all(transactions.map(async (transaction) => {
            const transactionObj = transaction.toObject();
            const item = await ItemSchema.findOne({ "_id": transactionObj.itemID });
            const image = getImage(item.image_file_name);

            return {
                transactionID: transactionObj._id,
                item_name: item.name,
                image: image,
                quantity: transactionObj.requested_quantity,
                amount: transactionObj.amount,
                status: transactionObj.status,
                created_date: transactionObj.createdAt
            };
        }));

        res.status(200).json(transactions_with_extra_data);
    } catch (e) {
        res.status(404).json({ message: "can't retrieve transaction data now!" });
    }
};

exports.cancelOrder = async (req, res) => {
    const transactionID = req.query.transactionID

    try {
        await TransactionSchema.deleteOne({ "_id": transactionID })

        res.status(200).json({ message: "sucessfully deleted order!" })
    } catch (e) {
        res.status(400).json({ message: "cant deleted order!" })
    }
}