const express = require('express');
const router = express.Router();
const bookController = require('../controllers/Book');
const multer = require('../middleware/multer'); // Middleware pour gérer les fichiers
const Auth = require('../middleware/auth');

// Route pour récupérer tous les livres
router.get('/', bookController.getAllBooks);

// Route pour récupérer le livre avec la meilleure note
router.get('/bestrating', bookController.getBestRatedBook);

// Route pour récupérer un livre par ID
router.get('/:id', bookController.getBookById);

// Route pour ajouter un nouveau livre
router.post('/',Auth, multer, bookController.createBook);

// Route pour ajouter une note à un livre
router.post('/:id/rating', Auth, bookController.rateBook);

// Route pour mettre à jour un livre
router.put('/:id',Auth, multer, bookController.updateBook);

// Route pour supprimer un livre
router.delete('/:id',Auth, bookController.deleteBook);




module.exports = router;
