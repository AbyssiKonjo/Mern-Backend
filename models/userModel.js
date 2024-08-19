const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// Static signup method
userSchema.statics.signup = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled in')
    }

    // Check if email is valid
    if(!validator.isEmail(email)) {
        throw Error ('Email is not valid')
    }

    // Check if password is strong enough
    // By default - min length 8; min lowercase 1; min number 1; min symbol 1
    if(!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough')
    }

    const exists = await this.findOne({email})

    if (exists) {
        throw Error('Email is already in use')
    }

    // Normal Password: mypassword
    // Add Salt: mypasswordj7hg4f6r3 (add slat to end of password)
    // Hash: 64ad45hsad798dhkjs76d45

    // Generate the salt with 10 characters:
    const salt = await bcrypt.genSalt(10);
    // Hash the password & salt combined
    const hash = await bcrypt.hash(password, salt);

    // Set the password to the hash value when creating the user:
    const user = await this.create({email, password:hash});

    return user
}

// Static login method
userSchema.statics.login = async function (email, password) {
    // Check if there is a value for the email & password 
    if (!email || !password) {
        throw Error('All fields mus bee filled in')
    }

    // Try find the user in our database with the email
    const user = await this.findOne({email})

    // Throw an error if no user found
    if (!user) {
        throw Error('Incorrect Email')
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password) // Return true or false

    // Throw an error if they don't match
    if(!match) {
        throw Error('Incorrect Password')
    }

    // If it does match
    return user
}

module.exports = mongoose.model('User', userSchema);