import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { api } from '../services/api'
import { GameImage } from '../components/GameCard'
import Status from '../components/Status'

export default function GameDetailPage() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [game, setGame] = useState(null)
    const [categories, setCategories] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [deleting, setDeleting] = useState(false)

    // RECUPERO DETTAGLI DEL GIOCO
    useEffect(() => {
        let active = true

        Promise.all([api.game(id), api.categories()])
            .then(([g, c]) => {
                if (active) {
                    setGame(g)
                    setCategories(c)
                }
            })
            .catch(e => active && setError(e.message))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [id])

    // ELIMINAZIONE GIOCO
    const remove = async () => {

        if (!window.confirm(`Eliminare definitivamente "${game.name}"?`)) {
            return
        }

        setDeleting(true)
        setError('')

        try {
            await api.deleteGame(id)

            navigate('/games', {
                replace: true,
                state: {
                    message: 'Gioco eliminato con successo.'
                }
            })

        } catch (e) {
            setError(e.message)
            setDeleting(false)
        }
    }

    return (
        <main className="page-wrap container">

            {/* INTESTAZIONE */}
            <div className="page-heading">

                <span className="eyebrow">
                    SCHEDA GIOCO
                </span>

                <h1>{game?.name || 'Dettaglio gioco'}</h1>

                <Link className="text-link" to="/games">
                    ← Torna al catalogo
                </Link>

            </div>

            <Status
                loading={loading}
                error={error}
            />

            {/* DETTAGLIO GIOCO */}
            {game && (
                <div className="paper-panel detail-layout">

                    <GameImage
                        game={game}
                        className="detail-image"
                    />

                    <div className="detail-content">

                        <span className="eyebrow">
                            NELLA TUA COLLEZIONE
                        </span>

                        <h2>{game.name}</h2>

                        <p className="detail-description">
                            {game.description || 'Nessuna descrizione disponibile.'}
                        </p>

                        {/* INFORMAZIONI */}
                        <dl className="detail-facts">

                            <div>
                                <dt>Giocatori minimi</dt>
                                <dd>{game.min_players}</dd>
                            </div>

                            <div>
                                <dt>Giocatori massimi</dt>
                                <dd>{game.max_players}</dd>
                            </div>

                            <div>
                                <dt>Durata</dt>
                                <dd>{game.duration_minutes} minuti</dd>
                            </div>

                            <div>
                                <dt>Età minima</dt>
                                <dd>{game.min_age}+ anni</dd>
                            </div>

                            <div>
                                <dt>Anno di pubblicazione</dt>
                                <dd>{game.release_year}</dd>
                            </div>

                            <div>
                                <dt>Categoria</dt>
                                <dd>
                                    {categories.find(
                                        c => String(c.id) === String(game.category_id)
                                    )?.name || 'Non disponibile'}
                                </dd>
                            </div>

                        </dl>

                        {/* AZIONI */}
                        <div className="action-row">

                            <Link
                                to={`/games/${id}/edit`}
                                className="btn-western"
                            >
                                Modifica gioco
                            </Link>

                            <button
                                type="button"
                                className="btn-outline-western danger"
                                onClick={remove}
                                disabled={deleting}
                            >
                                {deleting
                                    ? 'Eliminazione…'
                                    : 'Elimina gioco'}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </main>
    )
}
