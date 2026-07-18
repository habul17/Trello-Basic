const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware")
require("dotenv").config();


const app = express();

app.use(express.json());


// COUNTERS TO STORE IDs

let USERS_ID = 1;
let ORGANIZATIONS_ID = 1;
let BOARDS_ID = 1;
let ISSUES_ID = 1;


// IN-MEMORY DATABASE

const USERS = [{
    id : 0,
    userName : "AB",
    password : "AB123"
}];


const ORGANIZATIONS = [{
    id : 0,
    title : "AB-ORG",
    discription : "AB's ORGANIZATION",
    admin : 0,
    members : []
}];


const BOARDS = [{
    id : 0,
    title : "Frontend",
    organizationId : 0
}];


const ISSUES = [{
    id : 0,
    title : "Add Light Mode",
    boardId : 0,
    state : "IN_PROGRESS" // NEXT_up || IN_PROGRESS || DONE || ARCHIVED
}];



// POST ENDPOINTS - CREATE


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
        password,
        id: USERS_ID++
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

    const token = jwt.sign({
        userId : userExist.id
    }, process.env.JWT_SECRET);

    res.json({
        message : "Sign Up Successfull",
        token
    })

})


// POST - CREATE ORGANIZATIONS

app.post("/organization", (req, res) => {

});


// POST - ADD MEMBERS TO ORGANIZATION

app.post("/add-members-to-organizaiton", (req, res) => {

});


// POST - CREATE BOARDS

app.post("/boards", (req, res) => {

});


// POST - CREATE ISSUES

app.post("/issues", (req, res) => {

});



// GET ENDPOINTS - READ


// GET - VIEW ALL BOARDS

app.get("/boards", (req, res) => {

});


// GET - VIEW ALL ISSUES

app.get("/issues", (req, res) => {

});


// GET - VIEW ALL MEMBERS

app.get("/members", (req, res) => {

});


// PUT ENDPOINTS - UPDATE

// PUT - CHANGE ISSUES STATE


app.put("/issues", (req, res) => {

});


// DELETE ENDPOINTS - DELETE

// DELETE - REMOVE MEMBERS

app.delete("/members", (req, res) => {

});



app.listen(3000);
