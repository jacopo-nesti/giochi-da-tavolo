# Giochi da Tavolo API

Backend REST API per la gestione di un catalogo di giochi da tavolo, sviluppato come progetto didattico.

## Tecnologie

- Node.js + Express
- MySQL
- Docker e phpMyAdmin
- mysql2/promise
- dotenv

## Funzionalità

- Visualizzazione dei giochi e delle categorie
- Ricerca di un gioco tramite ID
- Inserimento di nuovi giochi e categorie
- Validazione dei dati ricevuti
- Gestione degli errori tramite Response DTO

## Struttura del progetto

```text
backend/
├── controllers/
├── routes/
├── dto/
├── db.js
└── server.js
```

## Installazione

1. Clona il repository.
2. Avvia MySQL con `docker compose up -d`.
3. Configura il file `.env` con le credenziali MySQL.
4. Installa le dipendenze:

```bash
npm install
```

5. Avvia il backend:

```bash
npm run dev
```

Il server sarà disponibile su `http://localhost:3000`.

Nota: le tabelle MySQL devono essere già create nel database.

## API disponibili

| Metodo | Endpoint | Descrizione |
|---|---|---|
| GET | /api/games | Tutti i giochi |
| GET | /api/games/:id | Gioco per ID |
| POST | /api/games | Crea un gioco |
| GET | /api/categories | Tutte le categorie |
| POST | /api/categories | Crea una categoria |

## Sviluppi futuri

- Operazioni PUT e DELETE
- Frontend React
- Ricerca e filtri

## Licenza

Distribuito sotto licenza MIT. Consulta il file LICENSE.
