const pool = require('../db.js')
const validateCategory = require('../validators/categoryValidator.js')
const ApiResponseDTO = require('../dto/ApiResponseDTO')

// GET - Recupera tutte le categorie
async function getAllCategories(req, res) {
    try {
        const [categories] = await pool.query(
            "SELECT * FROM categories"
        )

        return res.json(categories)

    } catch (err) {
        console.error(err)

        return res.status(500).json({
            success: false,
            error: "Errore nel recupero delle categorie"
        })
    }
}

// POST - Crea una nuova categoria
async function createCategory(req, res) {
    try {
        const name = req.body.name
        const notes = req.body.notes ?? null

        // Validazione tramite categoryValidator.js
        const validationError = validateCategory(req.body ?? {})

        if (validationError) {
            return res.status(400).json(
                new ApiResponseDTO(false, validationError, 400)
            )
        }

        // Pulizia dati
        const cleanName = name.trim()
        const cleanNotes = typeof notes === "string" ? notes.trim() : null

        // Controllo categoria già esistente
        const [existingCategories] = await pool.query(
            `
            SELECT id
            FROM categories
            WHERE LOWER(name) = LOWER(?)
            LIMIT 1
            `,
            [
                cleanName
            ]
        )

        if (existingCategories.length > 0) {
            return res.status(409).json(
                new ApiResponseDTO(false, "La categoria esiste già", 409)
            )
        }

        const [newCategory] = await pool.query(
            `
            INSERT INTO categories (
                name,
                notes
            )
            VALUES (?, ?)
            `,
            [
                cleanName,
                cleanNotes
            ]
        )

        return res.status(201).json(
            new ApiResponseDTO(true, "Categoria creata con successo", 201, {id: newCategory.insertId})
        )

    }
    catch (err) {
        console.error(err)

        return res.status(500).json(
            new ApiResponseDTO(false, "Errore durante la creazione della categoria", 500)
        )
    }
}

// PUT - Aggiornamento di una categoria esistente
async function updateExistingCategory(req, res) {
    try {
        // Recupero ID dall'URL
        const id = req.params.id

        // Validazione ID
        if (!Number.isInteger(Number(id)) || Number(id) < 1) {
            return res.status(400).json(
                new ApiResponseDTO(false, "L'id della categoria deve essere un numero intero positivo", 400)
            )
        }

        // Validazione dei dati tramite categoryValidator.js
        const validationError = validateCategory(req.body ?? {})

        if (validationError) {
            return res.status(400).json(
                new ApiResponseDTO(false, validationError, 400)
            )
        }

        // Recupero dati
        const name = req.body.name
        const notes = req.body.notes ?? null

        // Pulizia dati
        const cleanName = name.trim()
        const cleanNotes = typeof notes === "string" ? notes.trim() : null

        // Verifica esistenza categoria tramite ID
        const [categories] = await pool.query(
            `
            SELECT id
            FROM categories
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        )

        if (categories.length === 0) {
            return res.status(404).json(
                new ApiResponseDTO(false, "Categoria non trovata", 404)
            )
        }

        // Controllo nomi duplicati (escludendo la categoria corrente)
        const [existingCategories] = await pool.query(
            `
            SELECT id
            FROM categories
            WHERE LOWER(name) = LOWER(?)
            AND id != ?
            LIMIT 1
            `,
            [
                cleanName, 
                id
            ]
        )

        if (existingCategories.length > 0) {
            return res.status(409).json(
                new ApiResponseDTO(false, "Esiste già un'altra categoria con questo nome", 409)
            )
        }

        // Aggiornamento categoria
        const [updateCategory] = await pool.query(
            `
            UPDATE categories
            SET
                name = ?,
                notes = ?
            WHERE id = ?
            `,
            [
                cleanName,
                cleanNotes,
                id
            ]
        )

        // Controllo dell'aggiornamento
        if (updateCategory.affectedRows === 0) {
            return res.status(404).json(
                new ApiResponseDTO(false, "Categoria non trovata", 404)
            )
        }

        // Risposta positiva
        return res.status(200).json(
            new ApiResponseDTO(true, "Categoria aggiornato con successo", 200)
        )
        
    }
    catch (err) {
        console.error(err)

        return res.status(500).json(
            new ApiResponseDTO(false, "Errore durante l'aggiornamento della categoria", 500)
        )
    }
}

// DELETE - Eliminazione di una categoria esistente

// Esportazione delle funzioni
module.exports = {
    getAllCategories,
    createCategory,
    updateExistingCategory
}
