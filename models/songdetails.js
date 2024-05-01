// 2. Create Database and Collection
// songdetails.js (inside models directory)
const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  Songname: String,
  Film: String,
  Music_director: String,
  singer: String
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;

