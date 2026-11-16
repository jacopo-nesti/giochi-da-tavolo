const express = require('express')
const router = express.Router()

const {
    getAllCategories,
    createCategory
} = require('../controllers/categoriesController')

// GET - Tutte le categorie
router.get('/', getAllCategories)

// POST - Creazione nuova categoria
router.post('/', createCategory)

module.exports = router
