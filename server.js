const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// makes everything in the public accessible to the browser
app.use(express.static('public'));

// makes the form data accessible through req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// GET request
// when the client (browser) requests data from the server
app.get('/notes', function (req, res) {
    res.sendFile(__dirname + '/public/notes.html');
});

app.get('/api/notes', function (req, res) {
    res.sendFile(__dirname + '/db/db.json');
});

// create the get request for * that sends index.html 
app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// POST
// when the client is sending data to the server
app.post('/api/notes', function (req, res) {
    var newNote = req.body;

    var notes = fs.readFileSync(__dirname + '/db/db.json');
    notes = JSON.parse(notes);

    newNote.id = notes.length;
    notes.push(newNote);

    fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(notes));

    res.json(notes);
});

// Delete request

app.delete('/api/notes/:id', function(req, res) {
    var id = req.params.id;

    var notes = fs.readFileSync(__dirname + '/db/db.json');
    notes = JSON.parse(notes);
    notes = notes.filter(note => {
        if (note.id == id) {
            return false;
        } else {
            return true;
        }
    });

    fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(notes));

    res.json(notes);
})

app.listen(PORT, function() {
    console.log('Express server listening on port ' + PORT);
});