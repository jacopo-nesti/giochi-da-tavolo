import { api } from '../services/api'
import GameForm from '../components/GameForm'

export default function AddGamePage() {

    return (
        <main className="page-wrap container">

            {/* INTESTAZIONE */}
            <div className="page-heading">

                <span className="eyebrow">
                    NUOVA AVVENTURA
                </span>

                <h1>Aggiungi gioco</h1>

                <p>
                    Fai spazio a una nuova scoperta nella tua collezione.
                </p>

            </div>

            {/* FORM AGGIUNTA GIOCO */}
            <div className="paper-panel form-panel">

                <GameForm
                    submitLabel="Aggiungi gioco"
                    onSave={api.createGame}
                />

            </div>

        </main>
    )
}
