require('dotenv').config();
require('./models/config');
const express = require('express');
// const socketio = require('socket.io');
const fs = require('fs')
const path = require('path')
const {searchViewRouter, liveRouter} = require('./routers/index')

const app = express();


app.set('view engine', 'ejs');
app.use("/public", express.static(path.join(__dirname, "public")));

app.use('/search', searchViewRouter);
app.use('/live', liveRouter);

const server = app.listen(3000, ()=>{
    console.log('server on~')
})

// io.on('connection', (socket)=>{
//     console.log('클라이언트 입장')

// })