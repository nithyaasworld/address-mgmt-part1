require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require('cors');
const jwt = require('jsonwebtoken');

//routes
const authRouter = require('./routes/authRouter');
const addressRouter = require('./routes/addressRouter');

//controllers
const userController = require('./controllers/userController');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());


mongoose.connect('mongodb://127.0.0.1:27017/addresses', { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true})
    .then(()=> console.log("connected to mongo db"))
    .catch(err => console.log(err));

    // app.get('/', async (req, res) => {
    //     let books = await bookController.printAllBooks();
    //     console.log(books);
    //     res.render('index', {books: books})
    // })
    
    // let validateRequest = (req, res, next) => {
    //     let authHeader = req.headers['authorization'];
    //     console.log(authHeader);
    //     if(!req.headers['authorization']){
    //         res.status(403).send('No Authorization provided');
    //         return;
    //     }
    //     if(req.headers['authorization'].length < 8){
    //         res.status(403).send('Token not provided');
    //         return;
    //     }
    //     try{
    //         let data = jwt.verify(authHeader.split(' ')[1], process.env.ACCESS_TOKEN_SECRET);
    //         console.log("jwt verification result: ", data);
    //         next();
    //     }catch(err){
    //         res.status(403).send("Invalid token provided");
    //     }
    // }
    
    // app.use('/books', validateRequest, bookRouter);
    app.use('/auth', authRouter);
    app.use('/address', addressRouter);
    
    app.all(/.*/, (req, res) => {
        res.statusCode = 404;
        res.send('404 - Page not found');
    })
    

const PORT = 8100;
app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});


//https://gist.github.com/McLarenCollege/f1a21dbf6dfdcec6e06c33258602f93d