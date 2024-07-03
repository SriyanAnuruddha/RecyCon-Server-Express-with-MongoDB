const configs = require('./config/configs');
const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const http = require('http');
const { validateToken } = require('./middleware/JWT')
const { PORT, DB_URI } = configs;

// Import middlewares
const cors = require('cors');
const socketAuth = require('./middleware/SocketAuth');
const MessageSchema = require('./models/Message.model');
const usersRoutes = require('./routes/users.route');
const sellersRoute = require('./routes/sellers.route');
const buyersRoute = require('./routes/buyers.route');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server);

// Connect socket.io middleware for authentication
io.use(socketAuth);

// Routes
app.use('/users', usersRoutes);
app.use('/sellers', sellersRoute);
app.use('/buyers', buyersRoute);

app.get('/messages', validateToken, async (req, res) => {
    const { receiverId } = req.query;
    const { user_id } = req;

    try {
        const messages = await MessageSchema.find({
            $or: [
                { senderId: user_id, receiverId },
                { senderId: receiverId, receiverId: user_id }
            ]
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (e) {
        console.error('Error fetching messages:', e);
        res.status(500).json({ error: "Failed to retrieve messages" });
    }
});

app.get("/hello", (req, res) => {
    res.send("hello")
})


// Socket.io event handlers
io.on('connection', (socket) => {
    if (socket.user) {
        console.log(`User connected: ${socket.user.firstName} ${socket.user.lastName}`);
        socket.join(socket.user.user_id);

        socket.on('sendMessage', async ({ receiverId, content }) => {
            const message = new MessageSchema({
                senderId: socket.user.user_id,
                receiverId,
                content
            });

            console.log(content)

            try {
                console.log(message)
                await message.save();
                io.to(receiverId).emit('receiveMessage', message);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.firstName} ${socket.user.lastName}`);
        });
    } else {
        console.log('Unauthorized connection attempt');
        socket.disconnect(true); // Disconnect unauthorized connections
    }
});

// Connect to MongoDB and start the server
mongoose.connect(DB_URI).then(
    () => {
        console.log('Database connected!');
        server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    },
    (error) => {
        console.error('Error connecting to database:', error);
    }
);
