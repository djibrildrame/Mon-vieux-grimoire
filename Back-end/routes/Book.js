const express = require('express');
const router = express.Router();
const bookController = require('../controllers/Book');
const multer = require('../middleware/multer'); // Middleware pour gérer les fichiers
const Auth = require('../middleware/auth');

// Route pour récupérer tous les livres
router.get('/', bookController.getAllBooks);

// Route pour récupérer un livre par ID
router.get('/:id', bookController.getBookById);

// Route pour ajouter un nouveau livre
router.post('/',Auth, multer, bookController.createBook);

// Route pour mettre à jour un livre
router.put('/:id',Auth, bookController.updateBook);

// Route pour supprimer un livre
router.delete('/:id',Auth, bookController.deleteBook);

// Route pour récupérer le livre avec la meilleure note
router.get('/bestrating', bookController.getBestRatedBook);

module.exports = router;
