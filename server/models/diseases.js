/*
    MongoDB Schema for diseases
*/
const mongoose = require('mongoose');

const DiseaseSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    score: {
        type: Number,
        required: true,
        default: 0
    }
});

const Disease = mongoose.model('Disease', DiseaseSchema);

/*
    Default diseases in the system
    -> those will be added as soon as the system is live
    -> if they are deleted from the system, and the system restarts, then they will be added again in the system
*/

const scoreOfDisease = {}; // empty map

module.exports = { scoreOfDisease, Disease };
