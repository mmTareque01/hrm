const { User } = require("../server/models/user");
const bcrypt = require("bcryptjs");

const createUser = async (userData) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(userData.password, salt);

  return new User({ username: userData.username, password: hash }).save();
};

const getUserByUsername = async (username) => {
  return User.findOne({ username });
};

const getUserById = async (id) => {
  return User.findById(id);
};

const comparePassword = async (candidatePassword, hash) => {
  return bcrypt.compare(candidatePassword, hash);
};

const loginDemo = async (username, password) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return false;
    }
console.log("this is user:", user)
    const isMatched = await bcrypt.compare(password, user.password);
    return {user, isMatched}
    // const isMatched = await bcrypt.compare(password, user.password, (error, isMa))
  } catch (error) {}
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  comparePassword,
  loginDemo,
};
