const { sign, verify } = require("jsonwebtoken")

const socketAuth = (socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) return next(new Error('Authentication error: socket token missing'));

    try {
        const decodedToken = verify(token, "thisIsMySecret"); // Verify with your actual secret
        if (decodedToken) {
            socket.user = decodedToken;
            return next();
        }
    } catch (error) {
        return next(new Error('Authentication error: invalid socket token'));
    }
};

module.exports = socketAuth;
