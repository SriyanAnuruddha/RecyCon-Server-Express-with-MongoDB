const UserSchema = require('../models/User.model')
const bcrypt = require('bcrypt')
const { createToken } = require('../middleware/JWT')


exports.registerUser = async (req, res, next) => {

    try {
        const { firstName, lastName, email, country, city, password, accountType, coords } = req.body

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