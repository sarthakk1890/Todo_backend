const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
//jwt token has 3 parts:
//1. header: it has algorithm and token type
//2. payload or data: it has id, email and username
//3. signature: it is a digital signature of the header and payload
// the jwt token imported requires a predefined signature that is given by me

//Creatig user using: POST "/api/auth/createuser". No login required
// while using GET the password can be send to the computer logs and can be seen by someone to avoid this we use POST
// It is a good idea to use POST even with big data

const JWT_SECRET = "$arthak1234signature123online"; //it is the third part of jwt token (signatue)
var fetchuser = require('../middleware/fetchuser');
let success = false;

//Creating User:

router.post('/createuser', [
    body('name', "Enter a name(min3)").isLength({ min: 3 }),
    body('email', "Enter valid email").isEmail(),
    body('password', "Enter valid password").isLength({ min: 5 })
], async (req, res) => {

    const error_result = validationResult(req);
    let success = false;
    if (error_result.isEmpty()) {

        console.log("All entry Correct");

        try {
            //it is a function which returns a promise
            //check whether the user with same email exist or not
            let user = await User.findOne({ email: req.body.email }); //it is a promise hence we have to put await
            if (user) {
                return res.status(400).json({success, error: "User already exist. Try different email !" });
            }

            //Adding salt and hashing password
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            //Creating the user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass
            });

            //creating jwt token using id of user for better and fast retieval of data
            const data = {
                user: {
                    id: user.id
                }
            }
            success = true;
            const authtoken = jwt.sign(data, JWT_SECRET);
            res.json({success, authtoken });

        } catch (e) {
            console.error(e.message);
            res.status(500).send("Internal Server Error")
        }
        // .then(user => res.json(user))
        // .catch(err => {
        //     console.log(err);
        //     res.json({ "error": "Please enter unique email !" })
        // });

        //it is doing the same work as the lower lines and res.json() is same as res.send

        // const user = User(req.body);
        // user.save();
        // //this will save the input data in the User model ans as we are exporting user Schema in that module the database will be updated
        // return res.send(req.body);
    }

    //If there are errors, return bad request and the errors
    else {
        return res.status(400).json({success, errors: error_result.array() });
    }

});




//Login:
router.post('/login', [
    body('email', "Enter valid email").isEmail(),
    body('password', "Enter valid password").notEmpty()
], async (req, res) => {
    const error_result = validationResult(req);
    let success = false;
    if (error_result.isEmpty()) {

        const { email, password } = req.body;
        
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "Invalid credentials" });
            }

            const pass_check = await bcrypt.compare(password, user.password);

            if (!pass_check) {
                return res.status(400).json({ error: "Invalid credentials" });
            }

            const data = {
                user: {
                    id: user.id
                }
            }
            success=true
            const authtoken = jwt.sign(data, JWT_SECRET);
            res.json({success, authtoken });


        } catch (e) {
            console.error(e.message);
            res.status(500).send("Internal Server Error")
        }

    }
    else {
        return res.status(400).json({success, errors: error_result.array() });
    }

});


//Get User Detail : Login required in this
//to do this we'll create a middleware and pass it after the endpoint in router, basically when there is a request at the endpoint 
// middleware will run first then the (req,res) function

//fetchuser is middleware

router.post('/getuser' , fetchuser , async (req,res) =>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        //here "-password" means select everything except password
        res.send(user);
        

    } catch (e) {
        console.error(e.message);
        res.status(500).send("Internal Server Error")
    }
}) 

module.exports = router