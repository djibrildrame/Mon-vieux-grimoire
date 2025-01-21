const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Book = require('./models/Book');
const userRoutes = require('./routes/User');
const protectedRoutes = require('./routes/protectedRoutes');

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
      const updatedData = req.body; // Les nouvelles données envoyées dans la requête
  
      const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, { new: true });
  
      if (!updatedBook) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
  
      res.status(200).json({ message: 'Livre mis à jour avec succès !', book: updatedBook });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour du livre', error });
    }
  });

  app.use('/api/auth', userRoutes);
  app.use('/api', protectedRoutes);

// Gestion des routes non trouvées
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});



module.exports = app;
