const mongoose = require("mongoose");
const userschema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    max: 256,
  },
  lastName: {
    type: String,
    required: true,
    max: 256,
  },
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  gender: {
    type: String,
  },
  DOB: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    max: 1024,
  },
  contact: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type:String,
  }
});
module.exports = mongoose.model("user", userschema);
