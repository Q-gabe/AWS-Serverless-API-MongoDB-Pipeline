const mongoose = require('mongoose');
const PetSchema = new mongoose.Schema({
    name: String,
    species: String,
    age: Number,
    status: String
});

module.exports = mongoose.model('Pet', PetSchema);