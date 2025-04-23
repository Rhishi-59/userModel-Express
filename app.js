const express = require("express");
const app = express();
const authRouter = require('./router/authRoute');
const dbconnect = require("./config/databaseConfig");
const cookieParser = require('cookie-parser');
const cors = require('cors');

dbconnect();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}));

//you can also set CORS settings for individual routes like this
// app.get('/api', (req,res)=>{
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
// })

app.use('/api/auth/', authRouter);

app.use('/', (req,res)=>{
    res.status(200).json({data:'JWTauth server, welcome'});
});

module.exports = app;