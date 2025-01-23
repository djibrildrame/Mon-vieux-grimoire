const mongoose = require('mongoose');

// Définition du schéma pour les livres
const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Identifiant de l'utilisateur qui a créé le livre
  title: { type: String, required: true },  // Titre du livre
  author: { type: String, required: true }, // Auteur du livre
  imageUrl: { type: String, required: true }, // URL de l'image/couverture
  year: { type: Number, required: true }, // Année de publication
  genre: { type: String, required: true }, // Genre du livre
  ratings: [ // Liste des notes données au livre
    {
      userId: { type: String, required: true }, // Identifiant de l'utilisateur ayant noté le livre
      grade: { type: Number, required: true, min: 0, max: 5 }, // Note donnée (entre 0 et 5)
    }
  ],
  averageRating: { type: Number, default: 0 }, // Note moyenne du livre (calculée)
});

// Export du modèle
module.exports = mongoose.model('Book', bookSchema);
