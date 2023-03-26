var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("./connect")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const mysql = require('mysql2');
var app = express();
require("dotenv").config();


// 建立連線
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// 連接資料庫
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/user', (req, res) => {
    const query = "SELECT * FROM `user`"
    connection.query(query,() => (err, results, fields)=> {
            console.log(results); // results contains rows returned by server
            if (err) {
                return res.status(500).json({ message: err });

            } else {
                return res.status(200).json({ data: results });
            }
            // console.log(fields); // fields contains extra meta data about results, if available
        }
    );
})

app.post('/user', (req, res) => {
    const { name, email } = req.body;
    const newUser = { name, email };
    const query = 'INSERT INTO user SET ?';
    connection.query(query, newUser, (err, results) => {
        if (err) {
            return res.status(500).json({ message: err })
        } else {
            return res.status(200).json({ message: "create success" })
        }
    })
})

app.put('/user/:id', (req, res) => {
    const userId =req.params["id"];
    const { name, email } = req.body;
    const userData = { name, email };
    // console.log(req.params["id"]);
    const query = 'UPDATE user SET ? WHERE id = ?';
    connection.query(query, [userData,userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err })
        } else {
            return res.status(200).json({ message: "update success" })
        }
    })
})

app.delete('/user/:id', (req, res) => {
    const userId =req.params["id"];
    const query = 'DELETE FROM user WHERE id = ?';
    connection.query(query, userId, (err, results) => {
        if (err) {
            return res.status(500).json({ message: err })
        } else if(results.affectedRows ===0) {
            return res.status(400).json({ message: "user not found" })
        }else{
            return res.status(204).send()
        }
    })
})

module.exports = app;
