const express = require('express');
const api = require('./routes/api');

const app = express();

app.use(express.json());
app.use(api);

app.get('*',(req,res) => {
    res.status(200).send('Test');
})

app.listen(process.env.PORT,(req,res) => {
    console.log('Server Started');
});