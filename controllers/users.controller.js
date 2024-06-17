const UserSchema = require('../models/User.model')

exports.insertUser = async (req, res, next) => {

    try {
        await UserSchema.create(req.body)
        res.status(200).send("user added")
    } catch (e) {
        console.log(e)
        res.status(500).send("server error!")
    }

}