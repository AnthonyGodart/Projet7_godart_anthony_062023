const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

/* Configuration de Swagger */
// Définition des options Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for your API',
    },
    servers: [
      {
        url: 'http://localhost:4000', // Remplacez par l'URL de votre backend
      },
    ],
  },
  apis: ['./routes/books.js'], // Chemin vers les fichiers contenant les annotations Swagger
};
// Générer la spécification Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);
// Afficher la documentation Swagger via Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
/* Fin de configuration de Swagger */

mongoose.connect('mongodb+srv://testuser:TestUS3R@cluster.4srddnz.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(mongoSanitize());


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
