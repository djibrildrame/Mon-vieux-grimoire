const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Book = require('./models/Book');
const userRoutes = require('./routes/User');
const bookRoutes = require('./routes/Book');
const path = require('path');




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

app.use('/api/books', bookRoutes); // Routes livres
app.use('/api/auth', userRoutes);
// Servir les images stockées dans le dossier 'images'
app.use('/images', express.static(path.join(__dirname, 'images')));
 
  

// Gestion des routes non trouvées
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});



module.exports = app;
