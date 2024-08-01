const Chat = require("../models/chatModel");
const User = require("../models/userModels");
const Message = require("../models/messageModel");

const addOrUpdateChat = async (req, res) => {
    try {
        const { receiverId, message, chatName, users } = req.body;
        const senderUserId = req.user.id;

        let chat;

        if (chatName) {
            chat = await Chat.findOne({ chatName });
            if (!chat && !message) {
                const chatPayload = {
                    chatName,
                    isGroupChat: true,
                    latestMessage: null,
                    users: [...users, senderUserId],
                    groupAdmin: senderUserId

                }
                chat = await Chat.create({ ...chatPayload })
                return res.status(201).json({ success: true, message: "chat created successfully" })
            }
        } else {
            chat = await Chat.findOne({
                users: { $all: [senderUserId, receiverId] }
            });
        }

        if (!chat) {
            const senderUser = await User.findById(senderUserId);
            const receiverUser = receiverId ? await User.findById(receiverId) : null;

            if (!senderUser || (receiverId && !receiverUser)) {
                return res.status(400).json({ message: "Invalid user data" });
            }

            chat = await Chat.create({
                chatName: chatName || `${senderUserId}-${receiverId}`,
                isGroupChat: false,
                users: [senderUserId, receiverId].filter(Boolean), // Filter out null values
                groupAdmin: null
            });

            if (!chat) {
                return res.status(400).json({ message: "Failed to create chat" });
            }
        }

        const messagePayload = {
            sender: senderUserId,
            content: message,
            chat: chat._id
        };

        const createdMessage = await Message.create(messagePayload);

        chat.latestMessage = createdMessage._id;
        await chat.save();

        const populatedChat = await Chat.findById(chat._id)
            .populate("users", "name email pic")
            .populate("latestMessage");

        res.status(201).json({ ...populatedChat.toObject(), success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const fetchChat = async (req, res) => {
    try {
        const { receiverId, chatId } = req.query;
        const senderUserId = req.user.id;
        let chat

        if (!receiverId && !chatId) {
            return res.status(400).json({ message: "No chats available is unavailable" })
        }
        if (chatId) {
            chat = await Chat.findOne({ _id: chatId })
        } else {
            chat = await Chat.findOne({
                isGroupChat: false,
                users: { $all: [senderUserId, receiverId] }
            })
        }

        const messages = await Message.find({ chat: chat._id }).populate("sender", "name pic email").populate("chat")
        if (!chatId) {
            var newChatId = messages[0].chat._id
        }
        const messagesAltered = messages.map((message) => {
            return {
                message: message.content,
                senderId: message.sender._id,
                messageId: message._id,
                senderName: message.sender.name,
                senderMail: message.sender.email
            }
        })
        res.status(200).json({ messagesAltered, chatId: newChatId || chatId, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const fetchChats = async (req, res) => {
    try {
        const { userId } = req.query;
        const chats = await Chat.find({
            users: { $all: [userId] }
        }).populate({
            path: 'latestMessage',
            populate: {
                path: 'sender',
                select: 'name',
            },
        }).populate("users", "name pic email")
        res.status(200).json({ chatsList: chats, success: true })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { addOrUpdateChat, fetchChat, fetchChats };
