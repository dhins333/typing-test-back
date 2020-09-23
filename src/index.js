const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const shuffle = require('shuffle-array');

const api = require('./routes/api');
const Queue = require('./queue');
const words = require('./words');

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

    socket.on('queue',() => {
        queue.enqueue(socket.id);    
    })

    socket.on('disconnect',() => {
        if(socketMap[socket.id]){
            if(socketMap[socket.id] !== 'done'){
                io.to(socketMap[socket.id]).emit('op_disconnect','Opponent Disconnected');
            }
            delete socketMap[socket.id];
        }
        else if(queue.len != 0){
            queue.remove(socket.id);
        }
    })

    socket.on('progress',() => {
        io.to(socketMap[socket.id]).emit('op_progress');
    })

    socket.on('done',() => {
        io.to(socketMap[socket.id]).emit('lose');
        socketMap[socketMap[socket.id]] = 'done';
        socketMap[socket.id] = 'done';
    })

} )

server.listen(process.env.PORT,(req,res) => {
    setInterval(() => {
        if(queue.len >= 2){
            const a = queue.dequeue().data;
            const b = queue.dequeue().data;
            socketMap[a] = b;
            socketMap[b] = a;
            const temp = shuffle(words);
            io.to(a).emit('matched',temp);
            io.to(b).emit('matched',temp);
        }
    },5000)
});