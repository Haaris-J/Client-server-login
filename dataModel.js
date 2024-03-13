// author: muhammadhaaris.j

// Import the mongoose library
const mongoose = require('mongoose');

// Define a Mongoose schema named 'dataSchema'
// This schema represents the structure of a document in the 'client-server-login' collection
const dataSchema = new mongoose.Schema({
  // Define a property named 'name' with a data type of String
  username: String,
  secretcode: String,
  password: String,
  email: String,
  answer1: String,
  answer2: String,
});

const data = mongoose.model('data', dataSchema);
// Export the 'data' model for use in other parts of the application
module.exports = data;
