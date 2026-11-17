import { useEffect, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router'

import { api } from '../services/api'
import GameCard from '../components/GameCard'
import Status from '../components/Status'

export default function GamesPage() {

    const [params, setParams] = useSearchParams()
    const location = useLocation()

    const [games, setGames] = useState([])
    const [categories, setCategories] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [query, setQuery] = useState(params.get('q') || '')
    const [category, setCategory] = useState('')

    // RECUPERO GIOCHI E CATEGORIE
    useEffect(() => {
        let active = true

        Promise.all([api.games(), api.categories()])
            .then(([g, c]) => {
                if (active) {
                    setGames(g)
                    setCategories(c)
                }
            })
            .catch(e => active && setError(e.message))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [])

    // FILTRAGGIO DEI GIOCHI
    const visible = useMemo(
        () => games.filter(
            g =>
                g.name
                    .toLocaleLowerCase('it')
                    .includes(query.trim().toLocaleLowerCase('it')) &&
                (!category || String(g.category_id) === category)
        ),
        [games, query, category]
    )

    return (
        <main className="page-wrap container">

            {/* INTESTAZIONE */}
            <div className="page-heading">

                <span className="eyebrow">
                    IL CATALOGO
                </span>

                <h1>Tutti i giochi</h1>

                <p>
                    Trova il prossimo gioco da portare al tavolo.
                </p>

            </div>

            <div className="paper-panel">

                {/* MESSAGGIO DI SUCCESSO */}
                {location.state?.message && (
                    <div
                        className="alert alert-success"
                        role="status"
                    >
                        {location.state.message}
                    </div>
                )}

                {/* FILTRI DI RICERCA */}
                <div className="filter-row">

                    <label>
                        Nome del gioco

                        <input
                            className="form-control"
                            value={query}
                            placeholder="Cerca per nome..."
                            onChange={e => {
                                setQuery(e.target.value)

                                setParams(
                                    e.target.value
                                        ? { q: e.target.value }
                                        : {},
                                    { replace: true }
                                )
                            }}
                        />
                    </label>

                    <label>
                        Categoria

                        <select
                            className="form-select"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            <option value="">
                                Tutte le categorie
                            </option>

                            {categories.map(c => (
                                <option
                                    key={c.id}
                                    value={c.id}
                                >
                                    {c.name}
                                </option>
                            ))}

                        </select>
                    </label>

                </div>

                {/* STATO DELLA RICERCA */}
                <Status
                    loading={loading}
                    error={error}
                    empty={
                        !loading && !error && !visible.length
                            ? 'Nessun gioco trovato. Prova a cambiare i filtri.'
                            : null
                    }
                />

                {/* LISTA GIOCHI */}
                {!loading && !error && !!visible.length && (
                    <>
                        <p className="result-count">
                            {visible.length}
                            {' '}
                            {visible.length === 1
                                ? 'gioco trovato'
                                : 'giochi trovati'}
                        </p>

                        <div className="games-grid">

                            {visible.map(g => (
                                <GameCard
                                    key={g.id}
                                    game={g}
                                />
                            ))}

                        </div>
                    </>
                )}

            </div>

        </main>
    )
}
