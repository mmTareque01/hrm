const mongoose = require('mongoose');

// Define Room schema
const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  availability: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Define Room model
const Room = mongoose.model('Room', RoomSchema);

// Default rooms
const defaultRooms = {
  noroom: false,
};

// Function to populate default rooms in the database
async function populateDatabase() {
  try {
    for (const [name, availability] of Object.entries(defaultRooms)) {
      await Room.create({ name, availability });
    }
  } catch (error) {
    console.error('Error populating default rooms:', error);
  }
}

// populateDatabase();

module.exports = { Room };
