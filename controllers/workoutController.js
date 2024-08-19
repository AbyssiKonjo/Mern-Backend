// Import the model
const Workout = require('../models/workoutModel');
// Import mongoose
const mongoose = require('mongoose');

// FUNCTION TO GET THE ALL THE WORKOUT DATA:
const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({}).populate({
            path: 'comments',
            model: 'Comment'
        }).sort({createdAt: -1})
        res.status(200).json(workouts)
    } catch (error) {
        console.error(error);
        res.status(500).josn({error: 'Internal server error'})
    }
}

// Get Single Workout
const getWorkout = async (req, res) => {
    const {id} = req.params
    // Check if id is valid mongo id
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }
    // const workout = await Workout.findById(id) // Try and find a workout by it's id
    try {
        // find the workout, populate the comments array with the comment document
        const workout = await Workout.findById(id).populate({
            path: 'comments',
            model: 'Comments' // Reference the comments model
        })

        // if no workout found show an error
        if(!workout) {
        return res.status(404).json({error: 'No such workout'});
        }

         // Otherwise return the workout found
        res.status(200).json(workout)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal Server Error"})
    } 
}

const createWorkout = async (req, res) => {
    const {title, load, reps, user_id} = req.body

    // Get the uploaded image filename from the req.file object
    const imageFilename = req.file ? req.file.filename : null;

    // Add document to the database
    try {
        const workout = await Workout.create({
            title, 
            load, 
            reps, 
            user_id,
            image: imageFilename
        })
        res.status(200).json(workout)
    } catch (error) {
        res.status(400).json({error: error.message})
    } 
}

const deleteWorkout = async (req, res) => {
    // get the id from the request parameters
    const {id} = req.params;
    // Check if id iis valid mongo object id
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'});
    }

    // If it is valid - find and delete
    const workout = await Workout.findOneAndDelete({_id: id})

    // If id valid but no workout found
    if (!workout) {
        return res.status(404).json({error: 'No such workout'})
    }

    // If it successfully find and deletes:
    res.status(200).json(workout)
}

// UPDATE Workout
const updateWorkout = async (req, res) => {
    const {id} = req.params

    // Check if mono id id valid
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'});
    }

    // Find a workout by it's id
    // If it finds it then
    // Spread out the properties of the request
    // Edit/change what it receives
    // - that comes from the request body
    const workout = await Workout.findByIdAndUpdate(
        {_id: id}, 
        {...req.body},
        {new: true}
    );

    if(!workout) {
        return res.status(404).json({error: 'No such workout'});
    }

    // Return the updated workout
    res.status(200).json(workout)
}

module.exports = {getWorkouts, getWorkout, createWorkout, deleteWorkout, updateWorkout}