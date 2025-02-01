const Book = require('../models/Book'); // Importer le modèle Book
const upload = require('../middleware/multer');
 

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

    console.log(req.body);
    const newBook = JSON.parse(req.body.book);
    
    // Vérifier si un fichier a bien été uploadé
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Aucune image téléchargée' });
    }

    const book = new Book({
      userId: newBook.userId,
      title: newBook.title,
      author: newBook.author,
      imageUrl: imageUrl, // Utilisation de l'URL de l'image
      year: newBook.year,
      genre: newBook.genre,
      ratings: newBook.ratings || [],
      averageRating: newBook.averageRating || 0,
    });

    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création du livre', error });
  }
};

// Contrôleur pour récupérer le livre avec la meilleure note
exports.getBestRatedBook = async (req, res) => {
  try {
    const bestRatedBooks = await Book.find()
      .sort({ averageRating: -1 }) // Trie les livres par note moyenne, de la plus haute à la plus basse
      .limit(3); // Limite à 3 livres

    if (!bestRatedBooks.length) {
      return res.status(404).json({ message: 'Aucun livre trouvé' });
    }

    res.status(200).json(bestRatedBooks);
  } catch (error) {
    console.error(error); // Pour le debug
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};


// Contrôleur pour mettre à jour un livre
exports.updateBook = async (req, res) => {
  try {

    console.log(req.body);
    
  
    const newBook = req.file ? {
      ...JSON.parse(req.body.book), 
      imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : req.body;
    const bookId = req.params.id;
    const { userId, title, author,imageUrl, year, genre,rating } = newBook;

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { title, author, year, rating },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    res.status(200).json({ message: 'Livre mis à jour avec succès', book: updatedBook });
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

exports.rateBook = async (req, res) => {
  const { userId, rating } = req.body;
  const bookId = req.params.id;
  console.log('User ID:', userId);
  console.log('Book ID:', bookId);

  try {
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: "La note doit être comprise entre 0 et 5." });
    }

    const book = await Book.findById(bookId);
    console.log('Book found:', book);  // Ajoute ce log pour voir si le livre est trouvé

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    const existingRating = book.ratings.find(r => r.userId === userId);
    if (existingRating) {
      return res.status(400).json({ message: "Vous avez déjà noté ce livre." });
    }

    if (book.userId.toString() !== userId) {
      return res.status(403).json({ message: "Demande non autorisée. Vous ne pouvez pas modifier ce livre." });
    }

    book.ratings.push({ userId, grade: rating });

    const totalRatings = book.ratings.length;
    const totalScore = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
    const averageRating = totalScore / totalRatings;
    book.averageRating = averageRating;

    const updatedBook = await book.save();

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
