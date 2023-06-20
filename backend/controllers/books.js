const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book);
    console.log(bookObject);

    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.originalname}`
    });
    console.log(book)
    book.save()
    .then(() => {
        res.status(201).json({message: 'Livre enregistré !'});
        console.log({message: "Success creating book !"});
    })
    .catch(error => { 
        res.status(400).json( { error })
        console.log({ message: "Il y a eu un problème"})
    })
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.originalname}`
    } : { ...req.body };
    console.log(bookObject);
      
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Livre modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            console.error(error)
            res.status(500).json({ error });
        });
 };

exports.getOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
    .then(book => {
        res.status(200).json(book);
        console.log({message: "Success gettine ONE book"});
    })
    .catch(error => {
        res.status(400).json({ error });
        console.log({message: "No registered book !"})
    });
};

exports.getAllBooks = (req, res) => {
    Book.find()
    .then(books => {
        res.status(200).json(books);
        console.log({message: "Success getting ALL books"});
    })
    .catch(error => res.status(400).json({ error }));
};