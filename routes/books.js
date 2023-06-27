const express = require('express');
const auth = require('../middleware/auth');
const fileHandler = require('../middleware/multer-config');
const booksCtrl = require('../controllers/books');
const router = express.Router();

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     description: Create a new book
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */
router.post('/', auth, fileHandler, booksCtrl.createBook);

/**
 * @swagger
 * /books/bestrating:
 *   get:
 *     summary: Get top-rated books
 *     description: Get a list of top-rated books
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/bestrating', booksCtrl.getTopRatedBooks);

/**
 * @swagger
 * /books/{id}/rating:
 *   post:
 *     summary: Rate a book
 *     description: Rate a book
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the book to rate
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RatingInput'
 *     responses:
 *       201:
 *         description: Rating added successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Book not found
 */
router.post('/:id/rating', auth, booksCtrl.rateBook);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     description: Update a book by ID
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the book to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Book not found
 */
router.put('/:id', auth, fileHandler, booksCtrl.modifyBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     description: Delete a book by ID
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the book to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Book not found
 */
router.delete('/:id', auth, booksCtrl.deleteBook);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     description: Get a book by ID
 *     tags:
 *       - Books
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the book to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
router.get('/:id', booksCtrl.getOneBook);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     description: Get a list of all books
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/', booksCtrl.getAllBooks);

module.exports = router;
