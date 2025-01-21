const http = require('http');
const app = require('./App');

// Définir le port sur lequel le serveur va écouter
const PORT = process.env.PORT || 4000;
app.set('port', PORT);

// Créer le serveur
const server = http.createServer(app);

// Démarrer le serveur
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
