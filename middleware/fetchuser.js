var jwt = require('jsonwebtoken');
const JWT_SECRET = "$arthak1234signature123online";


const fetchuser = (req, res, next) => {
    //Get the user from JWT token and add id to req object
    const token = req.header('auth-token'); //taking token from header, auth-token is the name of header send during request
    //the header is the header inside the api request (in thunder client where we put content-type there we have to put "auth-token")

    if (!token) {
        res.status(401).json({ error: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        // it return a js object like { user: { id: '6469bc2bc01aac92f4558d6c' }, iat: 1684817331 }
        req.user = data.user;
        next(); //next indicate the (req,res) function in the auth.js
    } catch (error) {
        res.status(401).json({ error: "Please authenticate using a valid token" });
    }
}


module.exports = fetchuser;