const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware")
require("dotenv").config();


const app = express();

app.use(express.json());


// COUNTERS TO STORE IDs

let USER_ID = 1;
let ORGANIZATION_ID = 1;
let BOARD_ID = 1;
let ISSUE_ID = 1;


// IN-MEMORY DATABASE

const USERS = [{
    id: 0,
    userName: "AB",
    password: "AB123"
}];


const ORGANIZATIONS = [{
    id: 0,
    title: "AB-ORG",
    description: "AB's ORGANIZATION",
    admin: 0,
    members: []
}];


const BOARDS = [{
    id: 0,
    title: "Frontend",
    organizationId: 0
}];


const ISSUES = [{
    id: 0,
    title: "Add Light Mode",
    boardId: 0,
    state: "IN_PROGRESS" // NEXT_up || IN_PROGRESS || DONE || ARCHIVED
}];



// POST ENDPOINTS - CREATE


// POST - SIGNUP

app.post("/signup", (req, res) => {

    const userName = req.body.userName;
    const password = req.body.password;

    const userExist = USERS.find(user => user.userName === userName);

    if (userExist) {

        res.status(400).json({
            message: "User already exists"
        })
        return;

    }

    USERS.push({
        userName,
        password,
        id: USER_ID++
    })

    res.status(201).json({
        message: "User created successfully"
    })

})

// POST - SIGNIN

app.post("/signin", (req, res) => {

    const userName = req.body.userName;
    const password = req.body.password;

    const userExist = USERS.find(user => user.userName === userName && user.password === password);

    if (!userExist) {

        res.status(401).json({
            message: "Invalid Credentials"
        })
        return;

    }

    const token = jwt.sign({
        userId: userExist.id
    }, process.env.JWT_SECRET);

    res.json({
        message: "Sign In Successful",
        token
    })

})


// POST - CREATE ORGANIZATIONS

app.post("/organization", authMiddleware, (req, res) => {

    const userId = req.userId;

    ORGANIZATIONS.push({

        id: ORGANIZATION_ID++,
        title: req.body.title,
        description: req.body.description,
        admin: userId,
        members: []

    })

    res.json({
        message: "Organization Created Successfully",
        org_id: ORGANIZATION_ID - 1
    })

});


// POST - ADD MEMBERS TO ORGANIZATION

app.post("/add-members-to-organization", authMiddleware, (req, res) => {

    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUserName = req.body.memberUserName;

    const organization = ORGANIZATIONS.find(org => org.id === organizationId && org.admin === userId);

    if (!organization) {

        res.status(401).json({
            message: "Organization doesn't exist or you are not the admin"
        })
        return;

    }

    const member = USERS.find(user => user.userName === memberUserName);

    if (!member) {

        res.status(401).json({
            message: "Member doesn't exist"
        })
        return;

    }

    if (member.id === userId) {
        return res.status(400).json({
            message: "Admin is already part of the organization"
        });
    }

    if (organization.members.includes(member.id)) {
        return res.status(400).json({
            message: "Member already exists"
        });
    }

    organization.members.push(member.id);

    res.json({
        message: "Member added to the organization sucessfully",
        memberId: member.id,
        Id: organization.id
    })


});


// POST - CREATE BOARDS

app.post("/boards", (req, res) => {

});


// POST - CREATE ISSUES

app.post("/issues", (req, res) => {

});



// GET ENDPOINTS - READ


// GET - VIEW ALL ORGANIZATION

app.get("/organizations", authMiddleware, (req, res) => {

    const userId = req.userId;
    const organizationId = parseInt(req.query.organizationId);

    const organization = ORGANIZATIONS.find(org => org.id === organizationId && org.admin === userId);

    if (!organization) {

        res.status(401).json({
            message: "Organization doesn't exist or you are not the admin"
        })
        return;

    }

    res.json({
        organization: {
            ...organization,
            members: organization.members
                .map(memberId => USERS.find(user => user.id === memberId))
                .filter(Boolean)
                .map(user => ({
                    id: user.id,
                    userName: user.userName
                }))
        }
    })


});


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

app.delete("/members", authMiddleware, (req, res) => {

    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUserName = req.body.memberUserName;

    const organization = ORGANIZATIONS.find(org => org.id === organizationId && org.admin === userId);

    if (!organization) {

        res.status(401).json({
            message: "Organization doesn't exist or you are not the admin"
        })
        return;

    }

    const member = USERS.find(user => user.userName === memberUserName);

    if (!member) {

        res.status(401).json({
            message: "Member doesn't exist"
        })
        return;

    }

    if (!organization.members.includes(member.id)) {
        return res.status(401).json({
            message: "Member is not part of the organization"
        });
    }

    organization.members = organization.members.filter(
        memberId => memberId !== member.id
    );

    res.json({
        message: "Member Deleted from the organization sucessfully",
        memberId: member.id,
        organizationId: organization.id
    })

});



app.listen(3000);
