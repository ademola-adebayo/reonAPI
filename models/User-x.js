const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name:{
    type: String,
    trim: true,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  salt: String,
  created:{
    type: Date,
    default: Date.now
  },
  updated: Date
});


module.exports = mongoose.model("User", UserSchema);