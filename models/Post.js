const mongoose = require("mongoose");

module.exports = mongoose.model("Post", {

user: String,

text: String,

image: String,

likes: Number

});