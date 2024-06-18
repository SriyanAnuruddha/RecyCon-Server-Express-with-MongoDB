const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Please enter first name"]
        },
        lastName: {
            type: String,
            required: [true, "Please enter last name"]
        },
        email: {
            type: String,
            required: [true, "Please enter email"],
            unique: true
        },
        country: {
            type: String,
            required: [true, "Please enter country"]
        },
        city: {
            type: String,
            required: [true, "Please enter city"]
        },
        password: {
            type: String,
            required: [true, "Please enter password"]
        },
        accountType: {
            type: String,
            required: [true, "Please enter password"]
        }

    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', UserSchema)

module.exports = User