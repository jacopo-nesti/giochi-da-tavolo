export default function Status({ loading, error, empty, onRetry }) {

    // Stato di caricamento
    if (loading) {
        return (
            <div className="status-panel" role="status">
                Caricamento in corso…
            </div>
        )
    }

    // Stato di errore
    if (error) {
        return (
            <div className="status-panel error" role="alert">

                <strong>
                    Qualcosa è andato storto.
                </strong>

                <p>{error}</p>

                {onRetry && (
                    <button
                        className="btn-western"
                        onClick={onRetry}
                    >
                        Riprova
                    </button>
                )}

            </div>
        )
    }

    // Nessun dato disponibile
    if (empty) {
        return (
            <div className="status-panel">
                {empty}
            </div>
        )
    }

    return null
}
