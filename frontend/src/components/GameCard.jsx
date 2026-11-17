import { useState } from 'react'
import { Link } from 'react-router'

// COMPONENTE IMMAGINE
export function GameImage({ game, className = '' }) {

    const [failed, setFailed] = useState(false)

    return (
        <div className={`game-image ${className}`}>

            {game.image_url && !failed ? (

                <img
                    src={game.image_url}
                    alt={`Copertina di ${game.name}`}
                    onError={() => setFailed(true)}
                    loading="lazy"
                />

            ) : (

                <div
                    className="image-fallback"
                    role="img"
                    aria-label="Copertina non disponibile"
                >

                    <span aria-hidden="true">
                        ⚄
                    </span>

                    <small>
                        Copertina non disponibile
                    </small>

                </div>

            )}

        </div>
    )
}


// COMPONENTE CARD
export default function GameCard({ game }) {

    return (
        <Link
            to={`/games/${game.id}`}
            className="game-card"
        >

            {/* IMMAGINE */}
            <GameImage game={game} />

            {/* CONTENUTO */}
            <div className="game-card-body">

                <span className="card-kicker">
                    GIOCO DA TAVOLO
                </span>

                <h3>{game.name}</h3>

                {/* INFORMAZIONI GIOCO */}
                <div className="game-stats">

                    <span>
                        ♟ {game.min_players}–{game.max_players} giocatori
                    </span>

                    <span>
                        ◷ {game.duration_minutes} min
                    </span>

                    <span>
                        ☆ {game.min_age}+ anni
                    </span>

                </div>

                {/* COLLEGAMENTO DETTAGLIO */}
                <span className="card-link">
                    Scopri il gioco
                    {' '}
                    <span aria-hidden="true">→</span>
                </span>

            </div>

        </Link>
    )
}
