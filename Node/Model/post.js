const mongoose = require("mongoose");
const postschema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
    min: 1,
  },
  title: {
    type: String,
    required: true,
    min: 1,
  },
  path: {
    type: String,
    required: true,
    min: 1,
  },

  likes: {
    type: Array,
  },
  comments: {
    type: Array,
  },
  userId: {
    type: String,
    required: true,
  },
 userfirstName: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("post", postschema);
