# 🎲 BoardGame Manager

**Web app per la gestione di un catalogo di giochi da tavolo**, sviluppata come progetto didattico per approfondire lo sviluppo full-stack con JavaScript, React, Node.js, Express e MySQL.

L'applicazione permette di consultare, cercare, aggiungere, modificare ed eliminare giochi da tavolo e categorie attraverso un'interfaccia grafica ispirata all'atmosfera del Far West.

Il progetto nasce con l'obiettivo di comprendere e applicare i principali concetti dello sviluppo backend, della progettazione di API REST e della comunicazione tra frontend e database.

## Tecnologie utilizzate

### Frontend
- React
- Vite
- React Router
- JavaScript e JSX
- Bootstrap 5
- CSS personalizzato
- Fetch API

### Backend
- Node.js
- Express
- MySQL
- mysql2/promise
- dotenv
- cors

### Strumenti di sviluppo
- Docker e Docker Compose
- phpMyAdmin
- Postman
- Git e GitHub

## Funzionalità

### Gestione giochi
- Visualizzazione di tutti i giochi presenti nel database.
- Visualizzazione dei dettagli di un singolo gioco.
- Ricerca dei giochi per nome.
- Filtro per categoria.
- Inserimento di nuovi giochi.
- Modifica delle informazioni dei giochi esistenti.
- Eliminazione definitiva dei giochi, previa conferma.

### Gestione categorie
- Visualizzazione delle categorie.
- Creazione di nuove categorie.
- Modifica del nome e delle note.
- Eliminazione delle categorie non utilizzate.
- Controllo dei nomi duplicati.
- Protezione delle categorie associate a giochi tramite vincoli Foreign Key.

### Interfaccia utente
- Design responsive ispirato al Far West.
- Homepage con ricerca e carosello orizzontale.
- Schede dei giochi con immagini e informazioni principali.
- Form di inserimento e modifica.
- Gestione degli stati di caricamento, errore e assenza di dati.
- Messaggi di conferma dopo le operazioni.

### Backend e validazioni
- API REST per giochi e categorie.
- Query SQL parametrizzate.
- Validazioni dei dati ricevuti.
- Gestione degli errori HTTP.
- Response DTO per uniformare le risposte delle operazioni di modifica.
- Controllo dell'integrità referenziale tra giochi e categorie.

## Architettura del progetto

L'applicazione è suddivisa in frontend e backend.

```text
React
  |
  | HTTP / Fetch API
  v
Node.js + Express
  |
  | mysql2/promise
  v
MySQL
```

React gestisce l'interfaccia utente e invia richieste HTTP alle API Express.

Express gestisce le richieste, valida i dati, esegue le operazioni sul database MySQL e restituisce risposte JSON.

## Struttura del progetto

```text
boardgame-manager/
├── backend/
│   ├── controllers/
│   │   ├── gamesController.js
│   │   └── categoriesController.js
│   ├── routes/
│   │   ├── gamesRoutes.js
│   │   └── categoriesRoutes.js
│   ├── validators/
│   │   ├── gameValidator.js
│   │   └── categoryValidator.js
│   ├── dto/
│   │   └── ApiResponseDTO.js
│   ├── db.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
└── README.md
```

La struttura è semplificata e mostra le principali cartelle e i file applicativi.

## Database

Il database MySQL contiene due tabelle principali.

### Tabella `games`

| Campo | Descrizione |
|---|---|
| `id` | Identificativo del gioco |
| `name` | Nome |
| `description` | Descrizione |
| `min_players` | Numero minimo di giocatori |
| `max_players` | Numero massimo di giocatori |
| `duration_minutes` | Durata in minuti |
| `min_age` | Età minima consigliata |
| `release_year` | Anno di pubblicazione |
| `image_url` | URL della copertina |
| `category_id` | Foreign Key verso categories |

### Tabella `categories`

| Campo | Descrizione |
|---|---|
| `id` | Identificativo della categoria |
| `name` | Nome |
| `notes` | Note facoltative |

### Relazione

Ogni gioco appartiene a una categoria.

Una categoria può essere associata a più giochi.

La relazione è di tipo **uno-a-molti (1:N)**.

Il database utilizza un vincolo Foreign Key con `ON DELETE RESTRICT`, che impedisce di eliminare una categoria quando esistono giochi associati.

## Installazione e avvio

### Prerequisiti

- Node.js e npm
- Docker e Docker Compose
- Git

### 1. Clonazione

Clona il repository e accedi alla cartella del progetto.

### 2. Avvio database

Dalla directory che contiene il file Docker Compose:

```bash
docker compose up -d
```

Assicurati che MySQL sia avviato e che le tabelle `games` e `categories` siano state create.

### 3. Configurazione backend

Accedi alla cartella backend:

```bash
cd backend
npm install
```

Crea un file `.env` con le credenziali del database.

Esempio per l'ambiente di sviluppo locale:

```env
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASS=your_password
DB_NAME=giochi_da_tavolo
```

Adatta i valori alla tua configurazione Docker.

**Non pubblicare il file `.env` contenente credenziali reali su GitHub.**

Avvia il backend:

```bash
npm run dev
```

Il server Express sarà disponibile su:

`http://localhost:3000`

### 4. Avvio frontend

Apri un secondo terminale e accedi alla cartella frontend:

```bash
cd frontend
npm install
npm run dev
```

Il frontend Vite sarà normalmente disponibile su:

`http://localhost:5173`

Per configurare un URL backend differente, puoi utilizzare nel frontend la variabile:

```env
VITE_API_URL=http://localhost:3000
```

Il frontend e il backend devono essere entrambi avviati per utilizzare l'applicazione.

## API REST

### Games

| Metodo | Endpoint | Descrizione |
|---|---|---|
| GET | `/api/games` | Recupera tutti i giochi |
| GET | `/api/games/:id` | Recupera un gioco per ID |
| POST | `/api/games` | Crea un nuovo gioco |
| PUT | `/api/games/:id` | Aggiorna un gioco |
| DELETE | `/api/games/:id` | Elimina un gioco |

### Categories

| Metodo | Endpoint | Descrizione |
|---|---|---|
| GET | `/api/categories` | Recupera tutte le categorie |
| POST | `/api/categories` | Crea una categoria |
| PUT | `/api/categories/:id` | Aggiorna una categoria |
| DELETE | `/api/categories/:id` | Elimina una categoria |

### Esempio di richiesta POST

Endpoint:

`POST /api/games`

Body JSON:

```json
{
  "name": "Catan",
  "description": "Gioco di strategia e gestione delle risorse.",
  "min_players": 3,
  "max_players": 4,
  "duration_minutes": 60,
  "min_age": 10,
  "release_year": 1995,
  "image_url": null,
  "category_id": 1
}
```

Il valore di `category_id` deve corrispondere a una categoria esistente.

### Esempio di risposta

```json
{
  "success": true,
  "message": "Gioco creato con successo",
  "code": 201,
  "data": {
    "id": 1
  }
}
```

Le API GET restituiscono direttamente i dati JSON; le operazioni di creazione, aggiornamento ed eliminazione utilizzano il Response DTO.

## Gestione degli errori

Il backend utilizza codici HTTP appropriati per comunicare l'esito delle operazioni.

| Codice | Significato |
|---|---|
| `200 OK` | Operazione completata |
| `201 Created` | Risorsa creata |
| `400 Bad Request` | Dati non validi |
| `404 Not Found` | Risorsa inesistente |
| `409 Conflict` | Operazione in conflitto con i vincoli applicativi o del database |
| `500 Internal Server Error` | Errore interno del server |

Le query utilizzano parametri per separare i valori ricevuti dall'utente dalle istruzioni SQL.

Le validazioni vengono centralizzate nei file dedicati della cartella `validators`.

## Testing

Le API sono state testate manualmente tramite Postman, verificando operazioni CRUD, validazione degli input e gestione di diversi casi di errore.

L'interfaccia React utilizza le stesse API per interagire con il database attraverso Express.

## Stato del progetto

**Versione didattica funzionante — in evoluzione.**

Le funzionalità CRUD principali sono state implementate per giochi e categorie.

Al momento non è presente un sistema di autenticazione: gli endpoint di modifica non sono protetti da account utente. Il progetto non deve quindi essere distribuito pubblicamente come gestionale multiutente senza ulteriori misure di sicurezza.

## Sviluppi futuri

Possibili estensioni:

- Registrazione e login.
- Password hashing e gestione sicura delle sessioni.
- Middleware di autenticazione.
- Protezione degli endpoint.
- Distinzione tra utenti e amministratori.
- Area personale con collezioni di giochi.
- Miglioramento dei test automatici.
- Ottimizzazione e distribuzione dell'applicazione.

Le funzionalità saranno introdotte progressivamente, senza modificare inutilmente l'architettura già funzionante.

## Sviluppo e utilizzo dell'IA

Il backend Node.js/Express e le operazioni sul database sono stati sviluppati manualmente come esercizio di apprendimento.

La prima implementazione del frontend React e dello stile grafico è stata realizzata con il supporto di Codex, per poi essere sottoposta a revisione, studio e personalizzazione.

L'obiettivo del progetto è consolidare le competenze nello sviluppo full-stack e comprendere il funzionamento delle diverse componenti applicative.

## Licenza

Il progetto è distribuito sotto licenza MIT.

Consulta il file [LICENSE.md](./LICENSE.md) per maggiori informazioni.

## Autore

Creato da **Jacopo Nesti**