const express = require('express')
const router = express.Router()

// Importazione delle funzioni dal controller
const {
    getAllGames,
    getGameById,
    createGame,
    updateExistingGame
} = require('../controllers/gamesController')

// GET - Tutti i giochi
router.get('/', getAllGames)

// GET - Gioco per ID
router.get('/:id', getGameById)

// POST - Creazione nuovo gioco
router.post('/', createGame)

// PUT - Aggiornamento di un gioco esistente
router.put('/:id', updateExistingGame)

module.exports = router
