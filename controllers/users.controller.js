const UserSchema = require('../models/User.model')
const bcrypt = require('bcrypt')
const { createToken } = require('../middleware/JWT')


exports.registerUser = async (req, res, next) => {

    try {
        const { firstName, lastName, email, country, password, accountType, coords } = req.body

        const user = await UserSchema.findOne({ 'email': email }) // get the user details 
        if (user) {
            return res.status(400).json({ error: "this email is already been used" })
        }

        const hashedPassword = await bcrypt.hash(password, 10) // hash the password
        await UserSchema.create({
            firstName, lastName, email, country, password: hashedPassword, accountType, location: {
                type: "Point",
                coordinates: [coords.longitude, coords.latitude] // [longitude, latitude]
            }
        }) // store the user details in DB

        const storedUserObj = await UserSchema.findOne({ 'email': email })

        const token = createToken(storedUserObj) // create the JWT token

        if (storedUserObj && token) {
            res.status(200).json({
                user: {
                    user_id: storedUserObj._id.toString(),
                    firstName: storedUserObj.firstName,
                    lastName: storedUserObj.lastName,
                    email: storedUserObj.email,
                    accountType: storedUserObj.accountType,
                    country: storedUserObj.country
                },
                JWT_Token: token
            })
        }

    } catch (e) {
        console.log(e)
        res.status(500).send({ error: "server error! can't register user" })
    }

}

exports.userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Email or password is missing!");
        }

        const user = await UserSchema.findOne({ email });

        if (!user) {
            return res.status(404).send("Username or password is incorrect!");
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ error: "Username or password is incorrect!" });
        }

        const accessToken = createToken(user); // Create the JWT token for the user

        return res.status(200).json({
            user: {
                user_id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                accountType: user.accountType,
                country: user.country
            },
            JWT_Token: accessToken
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send("Server error! Can't login user.");
    }
};


exports.validateUser = (req, res, next) => {
    res.status(200).json({
        user_id: req.user_id,
        firstName: req.firstName,
        lastName: req.lastName,
        email: req.email,
        accountType: req.accountType
    })
}


exports.getUserDetails = async (req, res, next) => {
    try {
        const user_id = req.user_id;

        // Query the user by ID and select only the required fields
        const user = await UserSchema.findById(user_id).select('firstName lastName email');

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Respond with the user details
        return res.status(200).json({
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ error: "Server error! Can't fetch user details." });
    }
};


exports.updateUserDetails = async (req, res, next) => {
    try {
        const { firstName, lastName, email } = req.body;
        const user_id = req.user_id;

        // Validate that the required fields are provided
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ error: "First name, last name, and email are required!" });
        }

        // Find and update the user details
        const updatedUser = await UserSchema.findByIdAndUpdate(
            user_id,
            { firstName, lastName, email },
            { new: true, runValidators: true } // Return the updated user, and run Mongoose validation
        ).select('firstName lastName email');

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Respond with the updated user details
        return res.status(200).json({
            user: {
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email
            },
            message: "User details updated successfully!"
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ error: "Server error! Can't update user details." });
    }
};
