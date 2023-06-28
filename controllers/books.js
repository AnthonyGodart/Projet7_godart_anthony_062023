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
    const bookObject = req.file ? { ...JSON.parse(req.body.book) } : { ...req.body};
    delete bookObject._userId;

    Book.findOne({ _id: req.params.id })
      .then((book) => {
        if (book.userId !== req.auth.userId) {
          return res.status(401).json({ message: 'Not authorized' });
        };
        let imagePath = book.imageUrl;
        if (req.file) {
          imagePath = `${req.protocol}://${req.get('host')}/images/${req.file.originalname}`;
          bookObject.imageUrl = imagePath;
        };
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => {
            if (req.file && book.imageUrl && book.imageUrl !== imagePath) {
              fs.unlink(`./images/${getImageFileName(book.imageUrl)}`, (error) => {
                if (error) {
                  console.error(error);
                };
              });
            };
            res.status(200).json({ message: 'Livre modifié!' });
          })
          .catch((error) => res.status(401).json({ error }));
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
};
function getImageFileName(imageUrl) {
    const parts = imageUrl.split('/');
    return parts[parts.length - 1];
};
  
exports.rateBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            book.ratings.push({
                userId: req.auth.userId,
                grade: req.body.rating
            });
            let totalRating = 0;
            for (let i = 0; i < book.ratings.length; i++) {
                let currentRating = book.ratings[i].grade;
                totalRating += currentRating;
            }
            book.averageRating = totalRating / book.ratings.length;
            console.log(book.averageRating);
            return book.save();
        })
        .then(book => {
            console.log('Book saved:', book);
            res.status(201).json(book);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'évaluation du livre.' });
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

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => {
        res.status(200).json(book);
        console.log({message: "Success getting ONE book"});
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

exports.getTopRatedBooks = (req, res, next) => {
    Book.find()
    .sort({ 'averageRating': -1 })
    .limit(3)
    .then( books => {
        console.log({ message : "Les 3 meilleurs livres ont été récupérés !"});
        res.status(200).json(books);
    })
    .catch( error => {
        console.error({ message : "Erreur lors de la récupération des trois meilleurs livres"});
        res.status(401).json({ message : error});
    });
};