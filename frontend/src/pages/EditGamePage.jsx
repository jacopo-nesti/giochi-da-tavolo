import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { api } from '../services/api'
import GameForm from '../components/GameForm'
import Status from '../components/Status'

export default function EditGamePage() {

    const { id } = useParams()

    const [selected, setSelected] = useState(id || '')
    const [games, setGames] = useState([])
    const [game, setGame] = useState(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // RECUPERO ELENCO GIOCHI
    useEffect(() => {
        let active = true

        api.games()
            .then(g => active && setGames(g))
            .catch(e => active && setError(e.message))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [])

    // RECUPERO GIOCO SELEZIONATO
    useEffect(() => {
        if (!selected) {
            return
        }

        let active = true

        api.game(selected)
            .then(g => active && setGame(g))
            .catch(e => active && setError(e.message))

        return () => {
            active = false
        }
    }, [selected])

    return (
        <main className="page-wrap container">

            {/* INTESTAZIONE */}
            <div className="page-heading">

                <span className="eyebrow">
                    DARE NUOVA VITA
                </span>

                <h1>Aggiorna gioco</h1>

                <p>
                    Seleziona un gioco e modifica la sua scheda.
                </p>

            </div>

            <div className="paper-panel form-panel">

                <Status
                    loading={loading}
                    error={error}
                />

                {!loading && (
                    <>
                        {/* SELEZIONE GIOCO */}
                        <label className="selector-label">

                            Gioco da modificare

                            <select
                                className="form-select"
                                value={selected}
                                onChange={e => {
                                    setSelected(e.target.value)
                                    setGame(null)
                                    setError('')
                                }}
                            >
                                <option value="">
                                    Scegli un gioco
                                </option>

                                {games.map(g => (
                                    <option
                                        value={g.id}
                                        key={g.id}
                                    >
                                        {g.name}
                                    </option>
                                ))}

                            </select>

                        </label>

                        {/* CATALOGO VUOTO */}
                        {!games.length && !error && (
                            <Status empty="Non ci sono giochi da modificare." />
                        )}

                        {/* FORM MODIFICA */}
                        {game && !error && (
                            <GameForm
                                key={game.id}
                                initialGame={game}
                                submitLabel="Salva modifiche"
                                onSave={data => api.updateGame(game.id, data)}
                            />
                        )}

                    </>
                )}

            </div>

        </main>
    )
}
