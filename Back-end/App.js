const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Book = require('./models/Book');
const userRoutes = require('./routes/User');
const protectedRoutes = require('./routes/protectedRoutes');
const multer = require('./middleware/multer');

mongoose.connect('mongodb+srv://newuser:SecurePassword123@cluster0.2kskr3k.mongodb.net/test?retryWrites=true&w=majority',
 { useNewUrlParser: true,
   useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée :', err));

// Middleware pour parser le JSON
app.use(express.json());

// Middleware CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Middleware global pour surveiller les requêtes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // Passe au middleware suivant ou à la route
});


app.post('/api/books', async (req, res) => {
    try {
      const book = new Book(req.body);
      const savedBook = await book.save(); // Sauvegarder dans MongoDB
  
      res.status(201).json({
        message: 'Livre créé avec succès !',
        book: savedBook, // Inclut l'ID et toutes les propriétés
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création du livre', error });
    }
  });



  app.get('/api/books', async (req, res) => {
    try {
      const books = await Book.find(); // Récupérer tous les livres depuis MongoDB
      res.status(200).json(books); // Retourne un tableau de livres
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des livres', error });
    }

  });

  
  
  app.get('/api/books/:id', async (req, res) => {
    try {
      // Extraire l'ID du livre depuis les paramètres de la requête
      const bookId = req.params.id;
  
      // Rechercher un livre par son ID
      const book = await Book.findById(bookId);
  
      // Vérifier si un livre a été trouvé
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
  
      // Retourner le livre trouvé
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du livre', error });
    }
  });

  app.get('/api/books/bestrating', async (req, res) => {
    try {
      const book = await Book.find().sort({ rating: -1 }).limit(1); // Récupère le livre avec la meilleure note
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du livre', error });
    }
  });
  


// Route principale
app.get('/', (req, res) => {
    res.status(200).send('La réponse a été envoyée avec succès');
});


// Supprimer un livre
app.delete('/api/books/:id', async (req, res) => {
    try {
      const bookId = req.params.id; // Récupérer l'ID depuis l'URL
      const deletedBook = await Book.findByIdAndDelete(bookId);
  
      if (!deletedBook) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
  
      res.status(200).json({ message: 'Livre supprimé avec succès !', book: deletedBook });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression du livre', error });
    }
  });

// Mettre à jour un livre
app.put('/api/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id; // Récupérer l'ID depuis l'URL
    const requestBody = req.body; // Les données envoyées dans la requête

    let updatedData;

    // Vérifier si le corps de la requête correspond à un livre complet
    if (requestBody.title && requestBody.author && requestBody.imageUrl && requestBody.year) {
      updatedData = requestBody; // Si toutes les propriétés sont présentes, prendre le corps tel quel
    } 
    // Sinon, si le format est spécifique { book, image }
    else if (requestBody.book && requestBody.image) {
      updatedData = {
        title: requestBody.book, // Mettre à jour le titre avec `book`
        imageUrl: requestBody.image // Mettre à jour l'image avec `image`
      };
    } 
    // Si aucune de ces conditions n'est remplie, renvoyer une erreur
    else {
      return res.status(400).json({ 
        message: "Données invalides. Envoyez soit un objet Book complet, soit { book: string, image: string }." 
      });
    }

    // Mettre à jour le livre dans la base de données
    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, { new: true });

    // Si aucun livre n'a été trouvé
    if (!updatedBook) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    // Retourner le livre mis à jour
    res.status(200).json({ message: 'Livre mis à jour avec succès !', book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du livre', error });
  }
});



  app.use('/api/auth', userRoutes);
  app.use('/api', protectedRoutes);
  app.use('/images', express.static('images'));

// Gestion des routes non trouvées
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});



module.exports = app;
