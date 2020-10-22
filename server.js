var express = require("express");
var path = require("path");

const fs = require('fs');

var rawdata = fs.readFileSync('db/db.json');
var notes = JSON.parse(rawdata);

var app = express();
var PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", function(req, res) {
  var data = JSON.stringify(notes);
  fs.writeFileSync('db/db.json', data); 
  //return res.json(note);

  res.sendFile(path.join(__dirname, "public/notes.html"));
  });

app.get("/api/notes", function(req, res) {
    return res.json(notes);
  });

app.post("/api/notes", function(req, res) {
    var note = req.body;
    //add id to note
    note.id = notes.length;
    //add note to notes
    notes.push(note);
    //save it
    var data = JSON.stringify(notes);
    fs.writeFileSync('db/db.json', data);   
    //return it
    return res.json(note);
})

app.delete("/api/notes/:id", function(req, res) {
    //extract the :id and save it to a variable
    var id = req.params.id
    //loop through the notes and find the note with the matching id
    for (i = 0; i < notes.length; i++) {
      var note = notes[i];
      if (note.id == id) {
        //use splice to delete the note from notes
        notes.splice(i, 1);
      }
    }
    //write the new notes object (array) back to the file
    var data = JSON.stringify(notes);
    fs.writeFileSync('db/db.json', data); 
    return res.json(note);
})


app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
  });

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });