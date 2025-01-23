const express = require('express');
const router = express.Router();
const bookController = require('../controllers/Book');
const multer = require('../middleware/multer'); // Middleware pour gérer les fichiers

// Route pour récupérer tous les livres
router.get('/', bookController.getAllBooks);

// Route pour récupérer un livre par ID
router.get('/:id', bookController.getBookById);

// Route pour ajouter un nouveau livre
router.post('/', multer, bookController.createBook);

// Route pour mettre à jour un livre
router.put('/:id', bookController.updateBook);

// Route pour supprimer un livre
router.delete('/:id', bookController.deleteBook);

// Route pour récupérer le livre avec la meilleure note
router.get('/bestrating', bookController.getBestRatedBook);

module.exports = router;
