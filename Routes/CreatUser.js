const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtSecret = "mynameisrohitkumarvermaand&78";

// Create a new user for signup page
router.post("/createuser",[
    body('name').isLength({min:3}),
    body('location').isLength({min:5}),
    body('email').isEmail(),
    body('password').isLength({min:5})
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);

    try {
        await User.create({
            name : req.body.name,
            location : req.body.location,
            email : req.body.email,
            password : secPassword
        });
        
        res.json({success:true});
    } catch (error) {
        console.log(error);
        res.json({success:false});
    }
});

// Check a new user in database for Login page
router.post("/loginuser",[
    body('email').isEmail(),
    body('password').isLength({min:5})
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    let email = req.body.email;
    try {
        let userData = await User.findOne({email});
        if(!userData){
            return res.status(400).json({errors:"Try logging with right Email"});
        }

        const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
        if(!pwdCompare){
            return res.status(400).json({errors:"Try logging with right Password"});
        }

        const data = {
            user:{
                id:userData.id
            }
        }

        const authToken = jwt.sign(data, jwtSecret);

        return  res.json({success:true, authToken:authToken});
    } catch (error) {
        console.log(error);
        res.json({success:false});
    }
});

module.exports = router;