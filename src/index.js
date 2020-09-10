const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const api = require('./routes/api');
const Queue = require('./queue');
const shuffle = require('shuffle-array');
const socketMap = {};
const words = [
'lift',
'sin',
'break',
'ban',
'cool',
'evoke',
'blank',
'quota',
'utter',
'crop',
'elect',
'scan',
'still',
'strap',
'beach',
'jest',
'share',
'meal',
'ally',
'cheek',
'loose',
'doubt',
'stage',
'spite',
'coast',
'colon',
'hour',
'flash',
'in',
'ice',
'pull',
'pause',
'onion',
'jail',
'fan',
'mean',
'limit',
'floor',
'tick',
'issue',
'time',
'coma',
'liver',
'beg',
'weed',
'means',
'abuse',
'upset',
'snub',
'quota',
'salad',
'agent',
'model',
'feel',
'tiger',
'hero',
'soap',
'abbey',
'hate',
'pill',
'steam'];

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
        else if(queue.len != 0){
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
            const temp = shuffle(words);
            io.to(a).emit('matched',temp);
            io.to(b).emit('matched',temp);
        }
    },5000)
}

pairing();