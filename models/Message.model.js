const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema(
    {
        senderId: String,
        receiverId: String,
        content: String,
        location: {
            type: {
                latitude: { type: Number, required: false },
                longitude: { type: Number, required: false },
            },
            required: false
        }
    },
    {
        timestamps: true
    }
);


const Message = mongoose.model('Message', MessageSchema)

module.exports = Message