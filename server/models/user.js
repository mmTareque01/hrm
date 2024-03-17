const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Define the model User to be added in the database
const User = mongoose.model("User", UserSchema);

module.exports = { User };



// module.exports = {
//     createUser,
//     getUserByUsername: function (username) {
//       return   User.findOne({ username: username });
//     },
//     getUserById: function (id, callback) {
//         User.findById(id, callback);
//     },
//     comparePassword: function (candidatePassword, hash, callback) {
//         bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
//             if (err) {
//                 throw err;
//             }
//             callback(null, isMatch);
//         });
//     }
// };
