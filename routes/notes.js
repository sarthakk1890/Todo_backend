const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');



// Gett all the nodes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);

    } catch (e) {
        console.error(e.message);
        res.status(500).send("Internal Server Error");
    }
});

//Insert Notes
router.post('/addnote', fetchuser, [
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', "Enter at least 5 characters").isLength({ min: 5 })
], async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, description, tag } = req.body;
        const note = new Notes({
            title, description, tag, user: req.user.id
        });
        const savedNote = await note.save();
        res.json(savedNote);

    } catch (e) {
        console.error(e.message);
        res.status(500).send("Internal Server Error");
    }
});

//Update Note, for updating we'll use PUT
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    const { title, description, tag } = req.body;

    try {
        //creating new note
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Checking if note exists or not
        let note = await Notes.findById(req.params.id) //it is the id given at endpoint ":id"
        if (!note) { return res.status(404).send("Not Found!") }; //if the note doesn't exist

        //Confirming that the note belongs to the same person who is logged in
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        //If note exist and belong to same user then :
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note)

    } catch (e) {
        console.error(e.message);
        res.status(500).send("Internal Server Error");
    }

});


//Delete Note, for updating we'll use DELETE
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {

        //Checking if note exists or not
        let note = await Notes.findById(req.params.id) //it is the id given at endpoint ":id"
        if (!note) { return res.status(404).send("Not Found!") }; //if the note doesn't exist

        //Confirming that the note belongs to the same person who is logged in
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        //If note exist and belong to same user then :
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Deleted", "Note": note });

    } catch (e) {
        console.error(e.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router