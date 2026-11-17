import { Link } from 'react-router'

export default function Footer() {

    return (
        <footer className="site-footer">

            <div className="container footer-inner">

                {/* IDENTITÀ DEL SITO */}
                <div>

                    <strong>
                        ⚄ BoardGame Manager
                    </strong>

                    <small>
                        La tua collezione, tutta da scoprire.
                    </small>

                </div>

                {/* COLLEGAMENTI */}
                <div className="footer-links">

                    <Link to="/games/new">
                        Aggiungi gioco
                    </Link>

                    <Link to="/categories">
                        Aggiungi categoria
                    </Link>

                    <Link to="/games/edit">
                        Aggiorna gioco
                    </Link>

                    <Link to="/games">
                        Tutti i giochi
                    </Link>

                </div>

            </div>

        </footer>
    )
}
