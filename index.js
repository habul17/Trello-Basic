const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware")
require("dotenv").config();


const app = express();

app.use(express.json());


// In-Memory Database

const USERS = [];
const ORGANIZATIONS = [];
const BOARDS = [];
const ISSUES = [];


// POST ENDPOINTS


// POST - SIGNUP

app.post("/signup", (req, res) => {

    const userName = req.body.userName;
    const password = req.body.password;

    const userExist = USERS.find(user => user.userName === userName);

    if (userExist) {

        res.status(400).json({
            message : "User already exists"
        })
        return;

    }

    USERS.push({
        userName,
        password
    })

    res.status(201).json({
        message : "User created successfully"
    })

})

// POST - SIGNIN

app.post("/signin", (req, res) => {

    const userName = req.body.userName;
    const password = req.body.password;

    const userExist = USERS.find(user => user.userName === userName && user.password === password);

    if (!userExist) {

        res.status(403).json({
            message : "Invalid Credentials"
        })
        return;

    }

    const token = jwt.sign({userName}, process.env.JWT_SECRET);

    res.json({
        message : "Sign Up Successfull",
        token
    })



})


app.listen(3000);
