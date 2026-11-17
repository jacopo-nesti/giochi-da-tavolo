import { useRef } from 'react'

import GameCard from './GameCard'

export default function GameCarousel({ games }) {

    const track = useRef(null)

    // SCORRIMENTO ORIZZONTALE
    const scroll = direction => {
        track.current?.scrollBy({
            left: direction * 320,
            behavior: 'smooth'
        })
    }

    return (
        <div className="carousel-shell">

            {/* PULSANTI DI NAVIGAZIONE */}
            <div className="carousel-actions">

                <button
                    type="button"
                    aria-label="Scorri a sinistra"
                    onClick={() => scroll(-1)}
                >
                    ←
                </button>

                <button
                    type="button"
                    aria-label="Scorri a destra"
                    onClick={() => scroll(1)}
                >
                    →
                </button>

            </div>

            {/* CAROSELLO */}
            <div
                className="game-carousel"
                ref={track}
            >

                {games.map(game => (
                    <div
                        className="carousel-item-game"
                        key={game.id}
                    >
                        <GameCard game={game} />
                    </div>
                ))}

            </div>

        </div>
    )
}
