const pool = require('../db.js')
const ApiResponseDTO = require('../dto/ApiResponseDTO')

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
        const name = req.body.name
        const description = req.body.description
        const min_players = req.body.min_players
        const max_players = req.body.max_players
        const duration_minutes = req.body.duration_minutes
        const min_age = req.body.min_age
        const release_year = req.body.release_year
        const image_url = req.body.image_url ?? null
        const category_id = req.body.category_id

        // Validazione name
        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json(
                new ApiResponseDTO(false, "Il nome del gioco è obbligatorio", 400)
            )
        }

        // Validazione description
        if (typeof description !== "string") {
            return res.status(400).json(
                new ApiResponseDTO(false, "La descrizione deve essere testuale", 400)
            )
        }

        // Validazione min_players
        if (!Number.isInteger(min_players) || min_players < 1) {
            return res.status(400).json(
                new ApiResponseDTO(false, "Il numero minimo di giocatori deve essere un numero intero positivo", 400)
            )
        }

        // Validazione max_players
        if (!Number.isInteger(max_players) || max_players < 1 || min_players > max_players) {
            return res.status(400).json(
                new ApiResponseDTO(false, "Il numero minimo di giocatori deve essere un numero intero positivo", 400)
            )
        }

        // Validazione duration_minutes
        if (!Number.isInteger(duration_minutes) || duration_minutes < 1) {
            return res.status(400).json(
                new ApiResponseDTO(false, "La durata deve essere un numero intero positivo", 400)
            )
        }

        // Validazione min_age
        if (!Number.isInteger(min_age) || min_age < 1) {
            return res.status(400).json(
                new ApiResponseDTO(false, "L'età minima deve essere un numero intero positivo", 400)
            )
        }

        // Validazione release_year
        if (!Number.isInteger(release_year) || release_year < 1900 || release_year > 2030) {
            return res.status(400).json(
                new ApiResponseDTO(false, "L'anno deve essere compreso tra 1900 e 2030", 400)
            )
        }

        // Funzione controllo URL
        function isValideUrl(input) {
            if (!URL.canParse(input)) {
                return false
            }

            const url = new URL(input)
            return url.protocol === 'http:' || url.protocol === 'https:'
        }

        // Validazione image_url
        if (image_url !== null && !isValideUrl(image_url)) {
            return res.status(400).json(
                new ApiResponseDTO(false, "L'URL deve essere valido", 400)
            )
        }

        // Validazione category_id
        if (!Number.isInteger(category_id) || category_id < 1) {
            return res.status(400).json(
                new ApiResponseDTO(false, "L'id della categoria deve essere un numero intero positivo", 400)
            )
        }

        const [categories] = await pool.query(
            "SELECT id FROM categories WHERE id = ? LIMIT 1",
            [category_id]
        )

        if (categories.length === 0) {
            return res.status(400).json(
                new ApiResponseDTO(false, "La categoria selezionata non esiste", 400)
            )
        }

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
                name,
                description,
                min_players,
                max_players,
                duration_minutes,
                min_age,
                release_year,
                image_url,
                category_id
            ]
        )

        return res.status(201).json(
            new ApiResponseDTO(true, "Gioco creato con successo", 201, {id: newGame.insertId})
        )

    } catch (err) {
        console.error(err)

        return res.status(500).json(
            new ApiResponseDTO(false, "Errore durante la creazione del gioco", 500)
        )
    }
}

// Esportazione delle funzioni
module.exports = {
    getAllGames,
    getGameById,
    createGame
}
