const { sign, verify } = require("jsonwebtoken")

// Creates a JWT token by taking a user object as a parameter
const createToken = (user) => {
    const accessToken = sign(
        { user_id: user._id.toString(), firstName: user.firstName, lastName: user.lastName, email: user.email, accountType: user.accountType }, // needs to pass what we going to store in the token
        "thisIsMySecret"
    );

    return accessToken;
}

const validateToken = (req, res, next) => {

    // if (accessToken) {
    //     return res.status(400).json({ error: "user is not authenticated!" })
    // }

    try {
        const accessToken = req.headers.authorization.split(" ")[1]

        const decodedToken = verify(accessToken, "thisIsMySecret") // decode the JWT token
        if (decodedToken) {
            req.user_id = decodedToken.user_id
            req.firstName = decodedToken.firstName;
            req.lastName = decodedToken.lastName;
            req.email = decodedToken.email;
            req.accountType = decodedToken.accountType
            return next() // call next() to move forward when we have nothing left to do
        }
    } catch (error) {
        if (error instanceof TypeError) {
            return res.status(400).json({ error: "user is not authenticated!" })
        } else {
            return res.status(400).json({ error: "server token error" })
        }

    }
}



module.exports = { createToken, validateToken }