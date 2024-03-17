const mongoose = require('mongoose');
const _ = require('lodash');
const { Disease } = require('./diseases.js');
const rooms = require('./rooms.js');

// Define Patient schema
const PatientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  sex: {
    type: Boolean,
    required: true,
    default: true // true = male, false = female
  },
  hospitalNumber: {
    type: String,
    required: true,
    unique: true
  },
  diseases: {
    type: [String], // Array of disease names
    default: []
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  room: {
    type: String,
    required: true,
    default: 'noroom'
  },
  lastUpdate: {
    type: Date,
    required: true,
    default: Date.now
  }
});

// Method to update patient's score based on diseases
PatientSchema.methods.updateScore = async function () {
  const patient = this;

  try {
    const diseases = await Disease.find({});
    const scoreOfDisease = _.keyBy(diseases, 'name');

    let score = 0;

    patient.diseases.forEach(disease => {
      if (scoreOfDisease[disease]?.score > score) {
        score = scoreOfDisease[disease].score;
      }
    });

    patient.score = score;
    await patient.save();
  } catch (error) {
    console.error('Error updating patient score:', error);
  }
};

// Define Patient model
const Patient = mongoose.model('Patient', PatientSchema);

module.exports = { Patient };
