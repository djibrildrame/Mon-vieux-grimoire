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

    // j'ai fait en sorte que si l'utilisateur n'est pas celui qui a publié alors cela est rejeté et ne peut être modifié 
    if (req.auth.userId !== userId){
      return res.status(403).json({ message : "Vous n'êtes pas autorisé"})
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { title, author, year,genre,imageUrl,rating },
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
    const book = await Book.findById(bookId)
     
    // j'ai fait en sorte que si l'utilisateur n'est pas celui qui a publié alors cela est rejeté et ne peut être supprimé 
    if (req.auth.userId !== book.userId){
      return res.status(403).json({ message : "Vous n'êtes pas autorisé"})
    }

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
  try {
    const bookId = req.params.id;
    const { userId, rating } = req.body;

    // Vérifier si la note est entre 0 et 5
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: "La note doit être comprise entre 0 et 5." });
    }

    // Trouver le livre
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }

    // Vérifier si l'utilisateur a déjà noté ce livre
    const hasRated = book.ratings.find(r => r.userId === userId);
    if (hasRated) {
      return res.status(403).json({ message: "Vous avez déjà noté ce livre." });
    }

    // Ajouter la nouvelle note
    book.ratings.push({ userId, grade: rating });

    // Recalculer la moyenne des notes
    const totalRatings = book.ratings.length;
    const sumRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
    book.averageRating = sumRatings / totalRatings;

    // Sauvegarder les modifications
    await book.save();

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
