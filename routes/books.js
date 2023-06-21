const express = require('express');
const auth = require('../middleware/auth');
const fileHandler = require('../middleware/multer-config');
const booksCtrl = require('../controllers/books');
const router = express.Router();

router.post('/', auth, fileHandler, booksCtrl.createBook);
router.get('/bestrating', booksCtrl.getTopRatedBooks);
router.post('/:id/rating', auth, booksCtrl.rateBook);
router.put('/:id', auth, fileHandler, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.get('/:id', booksCtrl.getOneBook);
router.get('/', booksCtrl.getAllBooks);

module.exports = router;