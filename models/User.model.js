const mongoose = require('mongoose');

// Define the UserSchema
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
        password: {
            type: String,
            required: [true, "Please enter password"]
        },
        accountType: {
            type: String,
            required: [true, "Please enter account type"]
        },
        location: {
            type: {
                type: String,
                enum: ['Point'], // The only type supported is "Point"
                required: true
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            }
        }
    },
    {
        timestamps: true
    }
);

// Create a 2dsphere index on the location field
UserSchema.index({ location: '2dsphere' });

// Create the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
