const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const api = require('./routes/api');
const Queue = require('./queue');
const socketMap = {};

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const queue = new Queue();

app.use(express.json());
app.use(express.static(path.join(__dirname,'..','public')));
app.use(api);

app.get('*',(req,res) => {
    res.sendFile(path.join(__dirname,'..','public','index.html'));
})

io.on('connect',(socket) => {

    // console.log(socket.id);
    
    // socketMap[socket.id] = undefined;
    // console.log(queue,socketMap);

    socket.on('queue',() => {
        queue.enqueue(socket.id);    
    })

    socket.on('disconnect',() => {
        // delete socketMap[socket.id];
        // console.log(socketMap);
        // console.log('disconnected');
        io.to(socketMap[socket.id]).emit('op_disconnect','Opponent Disconnected');
        if(socketMap[socket.id]){
            delete socketMap[socket.id];
        }
        else{
            queue.remove(socket.id);
        }
        console.log(socketMap);
    })



} )

server.listen(process.env.PORT,(req,res) => {
    console.log('Server Started');
});

const pairing = () => {
    setInterval(() => {
        if(queue.len >= 2){
            const a = queue.dequeue().data;
            const b = queue.dequeue().data;
            socketMap[a] = b;
            socketMap[b] = a;
            io.to(a).emit('matched',socketMap[a]);
            io.to(b).emit('matched',socketMap[b]);
        }
    },5000)
}

pairing();