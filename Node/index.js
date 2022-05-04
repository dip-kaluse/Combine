const express= require('express');
const app=express();
const mongoose= require('mongoose');
var cors = require('cors')
const dotenv =require('dotenv');
const auth=require('./routes/node');
const posts = require('./routes/posts');
dotenv.config();
mongoose.connect(process.env.DB_CONNECT,()=>console.log("connece"));
app.use(express.json());
app.use(cors());
app.use('/',auth);
app.use('/api',posts);
app.listen(3000,()=>console.log("server is running"))