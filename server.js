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
const UserSchema = require('./models/User.model');


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



app.get('/chatlist', validateToken, async (req, res) => {
    const { user_id } = req;

    if (!user_id) {
        return res.status(400).json({ error: "Invalid user ID" });
    }

    try {
        const messages = await MessageSchema.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: user_id },
                        { receiverId: user_id }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderId", user_id] },
                            "$receiverId",
                            "$senderId"
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 0,
                    otherPartyId: "$_id",
                    lastMessage: {
                        senderId: "$lastMessage.senderId",
                        receiverId: "$lastMessage.receiverId",
                        content: "$lastMessage.content",
                        createdAt: "$lastMessage.createdAt"
                    }
                }
            }
        ]);

        const withNames = await Promise.all(messages.map(async (message) => {
            const user = await UserSchema.findOne({ "_id": message.otherPartyId });
            if (!user) return { ...message, otherPartyName: "Unknown" };
            const userObj = user.toObject();
            const userName = `${userObj.firstName} ${userObj.lastName}`;
            return { ...message, otherPartyName: userName };
        }));

        res.json(withNames);
    } catch (e) {
        console.error('Error fetching messages:', e);
        res.status(500).json({ error: "Failed to retrieve messages" });
    }
});


// Socket.io event handlers
io.on('connection', (socket) => {
    if (socket.user) {
        console.log(`User connected: ${socket.user.firstName} ${socket.user.lastName}`);
        socket.join(socket.user.user_id);

        socket.on('sendMessage', async ({ receiverId, content, location }) => {
            const message = new MessageSchema({
                senderId: socket.user.user_id,
                receiverId,
                content,
                location: { latitude: location?.latitude, longitude: location?.longitud }
            });
            try {
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
