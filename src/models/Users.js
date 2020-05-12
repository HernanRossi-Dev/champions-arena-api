const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userName: String,
  password: String,
  email: String,
});

module.exports = mongoose.model('users', UserSchema);
