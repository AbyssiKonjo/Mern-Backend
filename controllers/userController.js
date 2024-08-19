// import user Model
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// Create a jwt
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

//login
const loginUser = async (req,res) => {
    const {email, password} = req.body

    // Login user
    try {
        // Call our custom login static method from our user model
        const user = await User.login(email, password)

        // Create a token
        const token = createToken(user._id)

        // Return the email & newly logged-in jwt
        res.status(200).json({email, token})

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//signup
const signupUser = async (req,res) => {
    const {email, password} = req.body;

    try {
        // call on the custom signup static method we created in the User Model
        const user = await User.signup(email, password)

        // Create a token for the user
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message});
    }

    // res.json({mssg: 'signup user'})
}

module.exports = {signupUser, loginUser}