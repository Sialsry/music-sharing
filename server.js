require('dotenv').config();
require('./models/config');
const express = require('express');
const path = require('path');
const { detailRouter, mainRouter, liveRouter, mypageRouter, searchViewRouter } = require('./routers');
const cookieParser = require('cookie-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use('/public', express.static(path.join(__dirname, 'public'))); 
app.use(cookieParser());




app.use('/detail', detailRouter);
app.use('/', mainRouter);
app.use('/live', liveRouter);
app.use('/mypage', mypageRouter);
app.use('/search', searchViewRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...http://localhost:3000');
  });