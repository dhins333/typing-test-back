const express = require('express');
const path = require('path');
const api = require('./routes/api');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname,'..','public')));
app.use(api);

app.get('*',(req,res) => {
    res.sendFile(path.join(__dirname,'..','public','index.html'));
})

app.listen(process.env.PORT,(req,res) => {
    console.log('Server Started');
});