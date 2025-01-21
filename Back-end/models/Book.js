const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  annee: { type: Number, required: true },
  genre: { type: String, required: true },
  note: { type: String, required: true },
  image: { type: String, required: true }

});

module.exports = mongoose.model('Book', bookSchema);
