function validateGame(game) {

    const {
        name,
        description,
        min_players,
        max_players,
        duration_minutes,
        min_age,
        release_year,
        category_id
    } = game

    const image_url = game.image_url ?? null

    // Validazione name
    if (typeof name !== "string" || name.trim() === "") {
        return "Il nome del gioco è obbligatorio"
    }

    if (name.trim().length > 150) {
        return "Il nome non può superare 150 caratteri"
    }

    // Validazione description
    if (typeof description !== "string") {
        return "La descrizione deve essere testuale"
    }

    // Validazione min_players
    if (!Number.isInteger(min_players) || min_players < 1) {
        return "Il numero minimo di giocatori deve essere un numero intero positivo"
    }

    // Validazione max_players
    if (
        !Number.isInteger(max_players) ||
        max_players < 1 ||
        min_players > max_players
    ) {
        return "Il numero massimo di giocatori non è valido"
    }

    // Validazione duration_minutes
    if (!Number.isInteger(duration_minutes) || duration_minutes < 1) {
        return "La durata deve essere un numero intero positivo"
    }

    // Validazione min_age
    if (!Number.isInteger(min_age) || min_age < 1) {
        return "L'età minima deve essere un numero intero positivo"
    }

    // Validazione release_year
    if (
        !Number.isInteger(release_year) ||
        release_year < 1900 ||
        release_year > 2030
    ) {
        return "L'anno deve essere compreso tra 1900 e 2030"
    }

    // Funzione controllo URL
    function isValidUrl(input) {
        if (typeof input !== "string" || !URL.canParse(input)) {
            return false
        }

        const url = new URL(input)

        return url.protocol === "http:" || url.protocol === "https:"
    }

    // Validazione image_url (facoltativo)
    if (image_url !== null && !isValidUrl(image_url)) {
        return "L'URL deve essere valido (HTTP o HTTPS)"
    }

    if (image_url !== null && image_url.length > 500) {
        return "L'URL non può superare 500 caratteri"
    }

    // Validazione category_id
    if (!Number.isInteger(category_id) || category_id < 1) {
        return "L'ID della categoria deve essere un numero intero positivo"
    }

    // Tutte le validazioni superate
    return null
}

module.exports = validateGame
