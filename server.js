//importing express module
const express = require("express");

//importing node path module
const path = require("path");

//importing node fs module
const fs = require('fs');

//importing unique id creator module
const { v4: uuidv4 } = require('uuid');

//loading db.json database file
const rawdata = fs.readFileSync('db/db.json');

//parse db.json database to JSON object
const notes = JSON.parse(rawdata);

//creating instance of express
const app = express();

//specifying port for server to listen on 
const PORT = process.env.PORT || 3001;

//adding middleware to express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//new note page end point
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
  });

//get all notes end point
app.get("/api/notes", function(req, res) {
    return res.json(notes);
  });

//create note end point
app.post("/api/notes", function(req, res) {
    //creating note variable for user input note data
    var note = req.body;
    //add id to note data
    note.id = uuidv4();
    //add note data to notes
    notes.push(note);
    //converting JSON object to string
    var data = JSON.stringify(notes);
    //write new string to db.json file 
    fs.writeFileSync('db/db.json', data);   
    //returning new note
    return res.json(note);
})
//delete note end point
app.delete("/api/notes/:id", function(req, res) {
    //extract the :id data and save it to a variable
    var id = req.params.id
    //loop through the notes and find the note with the matching id
    for (i = 0; i < notes.length; i++) {
      var note = notes[i];
      if (note.id == id) {
        //use splice to delete the note from notes array
        notes.splice(i, 1);
      }
    }
    //convert notes array to string
    var data = JSON.stringify(notes);
    //write the new string to the db.json file
    fs.writeFileSync('db/db.json', data); 
    //return the deleted note
    return res.json(note);
})

//for all other requests, serve index.html
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
  });

//start the server
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });