const express = require('express')
const router = express.Router()

// Importazione delle funzioni dal controller
const {
    getAllGames,
    getGameById,
    createGame
} = require('../controllers/gamesController')

// GET - Tutti i giochi
router.get('/', getAllGames)

// GET - Gioco per ID
router.get('/:id', getGameById)

// POST - Creazione nuovo gioco
router.post('/', createGame)

module.exports = router
