const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assumes you have a User model
        required: true
    },
    buyerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assumes you have a User model
        required: true
    },
    itemID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    requested_quantity: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
