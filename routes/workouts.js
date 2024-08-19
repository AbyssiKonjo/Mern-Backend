// All the endpoints for our workouts
// bring in Express:
const express = require('express');
const router = express.Router();

// Multer JS Initialization:
const multer = require('multer')
const path = require("path")

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads') // Store uploads in this directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext); // Use unique filename
    },
});

const upload = multer({storage}); // public folder in the uploads

// Import the controller functions
const {
    getWorkouts,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout
} = require('../controllers/workoutController');

// Router variable + http method to create a route
router.get('/', getWorkouts);
router.get('/:id', getWorkout);
router.post('/', upload.single('image'), createWorkout);
router.delete('/:id', deleteWorkout);
router.patch('/:id', updateWorkout);

module.exports = router;