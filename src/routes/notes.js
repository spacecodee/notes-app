const express = require('express');
const router = express.Router();
const Note = require('../models/Notes');
const {isAuthenticated} = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res, next) => {
        res.render('notes/new-notes');
    }
)
;

router.post('/notes/new-note', isAuthenticated, async (req, res, next) => {
    const {title, description} = req.body;
    const errors = [];
    if (!title) {
        errors.push({text: "Please write a title"});
    }
    if (!description) {
        errors.push({text: "Please write a description"});
    }

    if (errors.length > 0) {
        res.render('notes/new-notes', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({
            title, description
        });
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Note add successfully');
        res.redirect('/notes');
    }
});

router.get('/notes', isAuthenticated, async (req, res, next) => {
    try {
        await Note.find({user: req.user.id}).sort({date: 'desc'}).then(
            documents => {
                const conext = {
                    notes: documents.map(document => {
                        return {
                            title: document.title,
                            description: document.description,
                            _id: document._id
                        }
                    })
                }
                res.render('notes/all-notes', {notes: conext.notes});
            }
        );

    } catch (e) {
        console.log(`Error: ${e}`);
    }
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res, next) => {
    try {
        await Note.findById(req.params.id).then(
            documents => {
                const conext = {
                    notes: {
                        title: documents.title,
                        description: documents.description,
                        _id: documents._id
                    }
                }
                res.render('notes/edit-note', {note: conext.notes});
            }
        );

    } catch (e) {
        console.log(`Error: ${e}`);
    }
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Note updated successfully');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note deleted successfully');
    res.redirect('/notes');
});

module.exports = router;
