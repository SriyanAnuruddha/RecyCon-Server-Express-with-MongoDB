const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema(
    {
        senderId: String,
        receiverId: String,
        content: String,
    },
    {
        timestamps: true
    }
);


const Message = mongoose.model('Message', MessageSchema)

module.exports = Message