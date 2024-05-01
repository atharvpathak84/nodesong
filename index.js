// 1. Connect to the mongodb
// index.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/music', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch(err => console.error(err));


// 3. Insert Song documents
// index.js
const Song = require('./models/songdetails');
const songs = [
    { Songname: 'Song1', Film: 'Film1', Music_director: 'Director1', singer: 'Singer1' },
    { Songname: 'Song2', Film: 'Film2', Music_director: 'Director2', singer: 'Singer2' },
    { Songname: 'Song3', Film: 'Film3', Music_director: 'Director3', singer: 'Singer3' },
    { Songname: 'Song4', Film: 'Film4', Music_director: 'Director4', singer: 'Singer4' },
  // Add more songs as needed
];
Song.insertMany(songs)
  .then(() => console.log('Songs inserted'))
  .catch(err => console.error(err));


// 4. Display Total Count and List All Documents
// index.js
app.get('/songs', async (req, res) => {
    try {
      const totalCount = await Song.countDocuments();
      const allSongs = await Song.find();
      res.json({ totalCount, allSongs });
    } catch (err) {
      res.status(500).send(err.message);
    }
});

// 5. List Songs by Music Director
// index.js
app.get('/songs-by-director/:director', async (req, res) => {
    try {
      const { director } = req.params;
      const directorSongs = await Song.find({ Music_director: director });
      res.json(directorSongs);
    } catch (err) {
      res.status(500).send(err.message);
    }
});
  
// 6. List Songs by Music Director and Singer
// index.js
app.get('/songs-by-director-and-singer/:director/:singer', async (req, res) => {
    try {
      const { director, singer } = req.params;
      const directorSingerSongs = await Song.find({ Music_director: director, singer: singer });
      res.json(directorSingerSongs);
    } catch (err) {
      res.status(500).send(err.message);
    }
});

// 7. Delete Song
// index.js
app.delete('/delete-song/:songName', async (req, res) => {
    try {
      const { songName } = req.params;
      await Song.deleteOne({ Songname: songName });
      res.send(`Song "${songName}" deleted successfully`);
    } catch (err) {
      res.status(500).send(err.message);
    }
});

// 8. Add New Favorite Song
// index.js
app.post('/add-favorite-song', async (req, res) => {
    try {
      const { Songname, Film, Music_director, singer } = req.body;
      const newSong = new Song({ Songname, Film, Music_director, singer });
      await newSong.save();
      res.send('New favorite song added successfully');
    } catch (err) {
      res.status(500).send(err.message);
    }
});

// 9. List Songs by Singer from Specified Film
// index.js
app.get('/songs-by-singer-from-film/:singer/:film', async (req, res) => {
    try {
      const { singer, film } = req.params;
      const singerFilmSongs = await Song.find({ singer: singer, Film: film });
      res.json(singerFilmSongs);
    } catch (err) {
      res.status(500).send(err.message);
    }
});

// 10. Update Document by Adding Actor and Actress Name
// index.js
app.put('/update-song/:songName', async (req, res) => {
    try {
      const { songName } = req.params;
      const { actor, actress } = req.body;
      await Song.updateOne({ Songname: songName }, { $set: { actor: actor, actress: actress } });
      res.send(`Song "${songName}" updated with actor "${actor}" and actress "${actress}"`);
    } catch (err) {
      res.status(500).send(err.message);
    }
});

// 11. Display Data in Browser in Tabular Format
// index.js
app.get('/songs-table', async (req, res) => {
    try {
      const songs = await Song.find({}, '-_id Songname Film Music_director singer actor actress');
      let tableHTML = '<table border="1"><tr><th>SongName</th><th>FilmName</th><th>MusicDirector</th><th>Singer</th><th>Actor</th><th>Actress</th></tr>';
      songs.forEach(song => {
        tableHTML += `<tr><td>${song.Songname}</td><td>${song.Film}</td><td>${song.Music_director}</td><td>${song.singer}</td><td>${song.actor || ''}</td><td>${song.actress || ''}</td></tr>`;
      });
      tableHTML += '</table>';
      res.send(tableHTML);
    } catch (err) {
      res.status(500).send(err.message);
    }
});
  
  
  

  
  


