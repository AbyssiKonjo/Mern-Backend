// Import the model
const Workout = require('../models/workoutModel');
// Import mongoose
const mongoose = require('mongoose');

// FUNCTION TO GET THE ALL THE WORKOUT DATA:
const getWorkouts = async (req, res) => {
    const workouts = await Workout.find({}).sort({createdAt: -1})
    res.status(200).json(workouts)
}

// Get Single Workout
const getWorkout = async (req, res) => {
    const {id} = req.params
    // Check if id is valid mongo id
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }
    // Try and find a workout by it's id
    const workout = await Workout.findById(id)
    // If no workout found show an error
    if(!workout) {
        return res.status(404).json({error: 'No such workout'})
    }
    // Otherwise return the workout found
    res.status(200).json(workout)
}

const createWorkout = async (req, res) => {
    const {title, load, reps} = req.body

    // Add document to the database
    try {
        const workout = await Workout.create({title, load, reps})
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
    res.status(200).json(workout + 'Successfully deleted')
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