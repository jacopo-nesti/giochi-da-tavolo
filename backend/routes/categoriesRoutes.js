const express = require('express')
const router = express.Router()

const {
    getAllCategories,
    createCategory,
    updateExistingCategory
} = require('../controllers/categoriesController')

// GET - Tutte le categorie
router.get('/', getAllCategories)

// POST - Creazione nuova categoria
router.post('/', createCategory)

// PUT - Aggiornamento categoria esistente
router.put('/:id', updateExistingCategory)

// HARD DELETE - Eliminazione di una categoria

module.exports = router
