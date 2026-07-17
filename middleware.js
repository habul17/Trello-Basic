const jwt = require("jsonwebtoken");
require("dotenv").config();


function authMiddleware(req, res, next) {

    const token = req.headers["token"];

    if (!token) {

        res.status(401).json({
            message : "Unauthorized"
        })

    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userName = decoded.userName;
        next();

    } catch (error) {

        res.status(401).json({
            message : "Invalid Token"
        })

    }

}

module.exports = {

    authMiddleware

}