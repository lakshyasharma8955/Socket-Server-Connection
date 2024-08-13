import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { fileURLToPath } from 'url';
import path from "path";
import{ formatMessage} from "./utils/messages.js";
import {userJoin,getCurrentUser,userLeave,getRoomUsers} from "./utils/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set Static Folder Path
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot'

const server = http.createServer(app); 
const io = new SocketServer(server);

// Run When Client Connects

io.on("connection",socket=>
{
    socket.on("joinRoom",({username,room})=>
    { 
       const user = userJoin(socket.id,username,room);
       socket.join(user.room)
             // Welcome Current User
    socket.emit("message",formatMessage(botName, 'Welcome to ChatCord!'));

    // BroadCast When a User Connect
    
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} joined the chat`));

    // send user and room info
    
    io.to(user.room).emit("roomUsers",
    {
        room:user.room,
        users:getRoomUsers(user.room)
    })

    })

    // Listen for Chat Message

    socket.on("chatMessage",msg=>
    {
        const user = getCurrentUser(socket.id);
       io.to(user.room).emit("message",formatMessage(user.username,msg))
    })

    // Runs when disconnect a client

    socket.on("disconnect",()=>
    {
        const user = userLeave(socket.id);
        if(user)
        {
            io.to(user.room).emit("message",formatMessage(botName,`${user.username} has left the chat`));

            
    // send user and room info
    
    // Send users and room info
    io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
        }
    })
})
    
const port = 3000;
server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
