const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth'); // Assure-toi que le middleware est bien importé

// Exemple de route protégée
router.get('/protected-route', verifyToken, (req, res) => {
    // Si le token est valide, tu peux accéder à `req.auth.userId`
    res.status(200).json({ message: 'Accès autorisé', userId: req.auth.userId });
});

module.exports = router;