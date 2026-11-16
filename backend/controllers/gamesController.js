const pool = require('../db.js')
const ApiResponseDTO = require('../dto/ApiResponseDTO')
const validateGame = require('../validators/gameValidator')

// GET - Recupera tutti i giochi
async function getAllGames(req, res) {
    try {
        const [games] = await pool.query(
            "SELECT * FROM games"
        )

        return res.json(games)

    } catch (err) {
        console.error(err)

        return res.status(500).json(
            new ApiResponseDTO(false, "Errore nel recupero dei giochi", 500)
        )
    }
}

// GET - Recupera un gioco tramite ID
async function getGameById(req, res) {
    const id = req.params.id

    // Validazione ID
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json(
            new ApiResponseDTO(false, "L'ID deve essere un numero intero positivo", 400)
        )
    }

    try {
        const [singleGame] = await pool.query(
            `
            SELECT *
            FROM games
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        )

        // Gioco inesistente
        if (singleGame.length === 0) {
            return res.status(404).json(
                new ApiResponseDTO(false, "Gioco non trovato", 404)
            )
        }

        return res.json(singleGame[0])

    } catch (err) {
        console.error(err)

        return res.status(500).json(
            new ApiResponseDTO(false, "Errore nel recupero del gioco", 500)
        )
    }
}


// POST - Crea un nuovo gioco
async function createGame(req, res) {
    try {

        // Validazione dei dati
        const validationError = validateGame(req.body ?? {})

        if (validationError) {
            return res.status(400).json(
                new ApiResponseDTO(false, validationError, 400)
            )
        }

        // Recupero dati
        const name = req.body.name
        const description = req.body.description
        const min_players = req.body.min_players
        const max_players = req.body.max_players
        const duration_minutes = req.body.duration_minutes
        const min_age = req.body.min_age
        const release_year = req.body.release_year
        const image_url = req.body.image_url ?? null
        const category_id = req.body.category_id

        // Verifica esistenza categoria nel database
        const [categories] = await pool.query(
            `
            SELECT id
            FROM categories
            WHERE id = ?
            LIMIT 1
            `,
            [category_id]
        )

        if (categories.length === 0) {
            return res.status(400).json(
                new ApiResponseDTO(false, "La categoria selezionata non esiste", 400)
            )
        }

        // Inserimento del gioco nel database
        const [newGame] = await pool.query(
            `
            INSERT INTO games (
                name,
                description,
                min_players,
                max_players,
                duration_minutes,
                min_age,
                release_year,
                image_url,
                category_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                name.trim(),
                description.trim(),
                min_players,
                max_players,
                duration_minutes,
                min_age,
                release_year,
                image_url,
                category_id
            ]
        )

        // Risposta positiva
        return res.status(201).json(
            new ApiResponseDTO(true, "Gioco creato con successo", 201, { id: newGame.insertId })
        )

    } catch (err) {
        console.error(err)

        return res.status(500).json(
            new ApiResponseDTO(false, "Errore durante la creazione del gioco", 500)
        )
    }
}


// PUT - Aggiornamento di un gioco esistente
async function updateExistingGame(req, res) {
    try {
        // Recupero ID dall'URL
        const id = req.params.id

        // Validazione ID
        if (!Number.isInteger(Number(id)) || Number(id) < 1) {
            return res.status(400).json(
                new ApiResponseDTO(false, "L'id del gioco deve essere un numero intero positivo", 400)
            )
        }

        // Validazione dati tramite gameValidator.js
        const validationError = validateGame(req.body ?? {})

        if (validationError) {
            return res.status(400).json(
                new ApiResponseDTO(false, validationError, 400)
            )
        }

        // Recupero dati
        const name = req.body.name
        const description = req.body.description
        const min_players = req.body.min_players
        const max_players = req.body.max_players
        const duration_minutes = req.body.duration_minutes
        const min_age = req.body.min_age
        const release_year = req.body.release_year
        const image_url = req.body.image_url ?? null
        const category_id = req.body.category_id

        // Verifica esistenza categoria
        const [categories] = await pool.query(
            "SELECT id FROM categories WHERE id = ? LIMIT 1",
            [category_id]
        )

        if (categories.length === 0) {
            return res.status(400).json(
                new ApiResponseDTO(false, "La categoria selezionata non esiste", 400)
            )
        }

        // Aggiornamento del gioco
        const [updateGame] = await pool.query(
            `
            UPDATE games
            SET
                name = ?,
                description = ?,
                min_players = ?,
                max_players = ?,
                duration_minutes = ?,
                min_age = ?,
                release_year = ?,
                image_url = ?,
                category_id = ?
            WHERE id = ?
            `,
            [
                name.trim(),
                description.trim(),
                min_players,
                max_players,
                duration_minutes,
                min_age,
                release_year,
                image_url,
                category_id,
                id
            ]
        )

        // Verifico esistenza gioco
        if (updateGame.affectedRows === 0) {
            return res.status(404).json(
                new ApiResponseDTO(false, "Gioco non trovato", 404)
            )
        }

        // Risposta positiva
        return res.status(200).json(
            new ApiResponseDTO(true, "Gioco aggiornato con successo", 200)
        )

    } catch (err) {
        console.error(err)

        return res.status(500).json(
            new ApiResponseDTO(false, "Errore durante l'aggiornamento del gioco", 500)
        )
    }
}

// DELETE - Eliminazione di un gioco esistente
async function deleteExistingGame(req, res) {
    try {
        // Recupero ID dall'URL
        const id = req.params.id

        // Validazione ID
        if (!Number.isInteger(Number(id)) || Number(id) <1) {
            return res.status(400).json(
                new ApiResponseDTO(false, "L'id del gioco deve essere un numero intero positivo", 400)
            )
        }

        // Hard delete del gioco nel database
        const [deleteGame] = await pool.query(
            `
            DELETE FROM games
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        )

        // Verifica esistenza del gioco
        if (deleteGame.affectedRows === 0) {
            return res.status(404).json(
                new ApiResponseDTO(false, "Il gioco selezionato non esiste", 404)
            )
        }

        // Risposta positiva
        return res.status(200).json(
            new ApiResponseDTO(true, "Gioco eliminato con successo", 200)
        )

    } catch (err) {
        console.error(err)

        return res.status(500).json(
            new ApiResponseDTO(false, "Errore durante l'eliminazione del gioco", 500)
        )
    }
}

// Esportazione delle funzioni
module.exports = {
    getAllGames,
    getGameById,
    createGame,
    updateExistingGame,
    deleteExistingGame
}
