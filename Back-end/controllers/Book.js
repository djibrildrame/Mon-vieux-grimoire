const Book = require('../models/Book'); // Importer le modèle Book

// Contrôleur pour récupérer tous les livres
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Contrôleur pour récupérer un livre par ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Contrôleur pour ajouter un nouveau livre
exports.createBook = async (req, res) => {
    try {
        const book = new Book({
            userId: req.body.userId,
            title: req.body.title,
            author: req.body.author,
            imageUrl: req.body.imageUrl,
            year: req.body.year,
            genre: req.body.genre,
            ratings: req.body.ratings || [],
            averageRating: req.body.averageRating || 0,
        });

        const savedBook = await book.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création du livre', error });
    }
};

exports.updateBook = async (req, res) => {
    try {
      const bookId = req.params.id;
  
      // Vérifier si le livre existe
      const existingBook = await Book.findById(bookId);
      if (!existingBook) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
  
      // Mise à jour des champs spécifiés
      const { title, author, imageUrl, year, genre } = req.body;
      if (title) existingBook.title = title;
      if (author) existingBook.author = author;
      if (imageUrl) existingBook.imageUrl = imageUrl;
      if (year) existingBook.year = year;
      if (genre) existingBook.genre = genre;
  
      // Sauvegarde du livre mis à jour
      const updatedBook = await existingBook.save();
  
      res.status(200).json({
        message: 'Livre mis à jour avec succès',
        book: updatedBook,
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error });
    }
  };
  

// Contrôleur pour supprimer un livre
exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    res.status(200).json({ message: 'Livre supprimé avec succès', book: deletedBook });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Contrôleur pour récupérer le livre avec la meilleure note
exports.getBestRatedBook = async (req, res) => {
  try {
    const bestRatedBook = await Book.find().sort({ rating: -1 }).limit(1);
    res.status(200).json(bestRatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
