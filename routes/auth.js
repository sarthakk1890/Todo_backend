const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const JWT_SECRET = "$arthak1234signature123online"; 
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
           
            let user = await User.findOne({ email: req.body.email }); 
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
    }

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