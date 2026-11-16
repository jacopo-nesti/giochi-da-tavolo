const pool = require('../db.js')
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

// POST - Crea una nuova categorie
async function createCategory(req, res) {
    try {
        const name = req.body.name
        const notes = req.body.notes ?? null

        // Validazione name categoria
        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json(
                new ApiResponseDTO(false, "Il nome della categoria è obbligatorio", 400)
            )
        }

        // Validazione lunghezza name
        if (name.trim().length > 100) {
            return res.status(400).json(
                new ApiResponseDTO(false, "Il nome non può superare 100 caratteri", 400)
            )
        }

        // Validazione notes (facoltativo)
        if (notes !== null && typeof notes !== "string") {
            return res.status(400).json(
                new ApiResponseDTO(false, "Le note devono essere testuali", 400)
            )
        }

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
            [cleanName]
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

// Esportazione delle funzioni
module.exports = {
    getAllCategories,
    createCategory
}
