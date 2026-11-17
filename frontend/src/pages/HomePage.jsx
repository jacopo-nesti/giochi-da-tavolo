import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { api } from '../services/api'
import GameCarousel from '../components/GameCarousel'
import Status from '../components/Status'

export default function HomePage() {

    const navigate = useNavigate()

    const [query, setQuery] = useState('')
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        api.games()
            .then(data => active && setGames(data))
            .catch(e => active && setError(e.message))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [])

    return (
        <main>

            {/* HERO SECTION */}
            <section className="hero">

                <div className="hero-sun" aria-hidden="true"></div>
                <div className="hero-mesa mesa-left" aria-hidden="true"></div>
                <div className="hero-mesa mesa-right" aria-hidden="true"></div>

                <div className="hero-content container">

                    <div className="hero-stars" aria-hidden="true">
                        ★ <span>✦</span> ★
                    </div>

                    <p className="eyebrow">
                        BENVENUTO NEL TUO SALOON
                    </p>

                    <h1>
                        IL TUO CATALOGO<br />
                        DI GIOCHI DA TAVOLO
                    </h1>

                    <div className="hero-divider" aria-hidden="true">
                        ◆
                    </div>

                    <p className="hero-subtitle">
                        Cerca, scopri e gestisci la tua collezione di giochi!
                    </p>

                    {/* FORM DI RICERCA */}
                    <form
                        className="hero-search"
                        role="search"
                        onSubmit={e => {
                            e.preventDefault()
                            navigate(`/games?q=${encodeURIComponent(query.trim())}`)
                        }}
                    >
                        <label
                            className="visually-hidden"
                            htmlFor="hero-query"
                        >
                            Cerca un gioco
                        </label>

                        <span aria-hidden="true">⌕</span>

                        <input
                            id="hero-query"
                            placeholder="Cerca un gioco..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="btn-western"
                        >
                            Cerca
                        </button>
                    </form>

                </div>

                <div className="hero-ground" aria-hidden="true"></div>

            </section>

            {/* GIOCHI IN EVIDENZA */}
            <section className="featured-section">

                <div className="container">

                    <div className="section-title">
                        <span aria-hidden="true">★</span>
                        <h2>Giochi in evidenza</h2>
                        <span aria-hidden="true">★</span>
                        <div className="title-rule"></div>
                    </div>

                    <Status
                        loading={loading}
                        error={error}
                        empty={
                            !loading && !error && !games.length
                                ? 'Il catalogo è vuoto. Aggiungi il tuo primo gioco!'
                                : null
                        }
                    />

                    {!loading && !error && !!games.length && (
                        <GameCarousel games={games.slice(0, 12)} />
                    )}

                </div>

            </section>

        </main>
    )
}
