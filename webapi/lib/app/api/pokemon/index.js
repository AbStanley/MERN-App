const handlers = require('./handlers');
const router = require('express').Router();
const config = require('../../../config');
const multer = require('multer');
const upload = multer(config.multer.opts);

// Register middleware functions for URLs (relative to mount point)
router
    .post('/login', handlers.login)
    .use(handlers.checkAuthToken)
    .get('/', handlers.findPokemon)
    .get('/types', handlers.getValidTypes)
    .get('/:id', handlers.getPokemonById)
    .post('/', handlers.addPokemon)
    .post('/avatar/:id', upload.single('avatar'), handlers.uploadAvatar)
    .put('/:id', handlers.updatePokemon)
    .delete('/:id', handlers.deletePokemon)
;

module.exports = router;
