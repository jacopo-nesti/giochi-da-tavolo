const API_BASE = (
    import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/$/, '')


// Classe personalizzata per la gestione degli errori
export class ApiError extends Error {
    constructor(message, status, code) {
        super(message)

        this.name = 'ApiError'
        this.status = status
        this.code = code
    }
}


// Funzione generica per le richieste API
async function request(path, options = {}) {
    let response

    try {
        response = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        })

    } catch {
        throw new ApiError(
            'Impossibile contattare il server. Verifica che il backend sia avviato su localhost:3000.',
            0
        )
    }

    // Conversione della risposta in JSON
    const body = await response.json().catch(() => null)

    // Gestione degli errori HTTP
    if (!response.ok || body?.success === false) {
        const defaults = {
            400: 'Dati non validi.',
            404: 'Elemento non trovato.',
            409: 'Operazione non consentita: elemento già presente o in uso.',
            500: 'Errore del server. Riprova più tardi.'
        }

        throw new ApiError(
            body?.message ||
            body?.error ||
            defaults[response.status] ||
            'Richiesta non riuscita.',
            response.status,
            body?.code
        )
    }

    return body
}


// Funzioni API per giochi e categorie
export const api = {

    // GAMES - GET
    games: () => request('/api/games'),

    game: (id) => request(
        `/api/games/${encodeURIComponent(id)}`
    ),

    // GAMES - POST
    createGame: (data) => request('/api/games', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    // GAMES - PUT
    updateGame: (id, data) => request(
        `/api/games/${encodeURIComponent(id)}`,
        {
            method: 'PUT',
            body: JSON.stringify(data)
        }
    ),

    // GAMES - DELETE
    deleteGame: (id) => request(
        `/api/games/${encodeURIComponent(id)}`,
        {
            method: 'DELETE'
        }
    ),

    // CATEGORIES - GET
    categories: () => request('/api/categories'),

    // CATEGORIES - POST
    createCategory: (data) => request('/api/categories', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    // CATEGORIES - PUT
    updateCategory: (id, data) => request(
        `/api/categories/${encodeURIComponent(id)}`,
        {
            method: 'PUT',
            body: JSON.stringify(data)
        }
    ),

    // CATEGORIES - DELETE
    deleteCategory: (id) => request(
        `/api/categories/${encodeURIComponent(id)}`,
        {
            method: 'DELETE'
        }
    )
}
