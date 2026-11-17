# BoardGame Manager — frontend

Frontend React/Vite per il catalogo di giochi da tavolo. Le API REST esistenti sono servite dal backend sulla porta 3000.

## Avvio

1. Avvia MySQL e il backend seguendo le istruzioni del repository. Il backend deve rispondere su `http://localhost:3000`.
2. Da questa cartella esegui `npm install` (se necessario) e `npm run dev`.
3. Apri `http://localhost:5173`.

Per impostare un'origine API diversa, crea un file `.env.local` **in questa cartella** con `VITE_API_URL=http://localhost:3000`. L'origine frontend deve essere consentita dalla configurazione CORS del backend.

## Verifica

`npm run lint` e `npm run build`.

Le immagini dei giochi provengono dal campo `image_url`; se manca o non si carica, compare un segnaposto originale. I giochi in evidenza sono i primi disponibili dalla GET, senza inventare classifiche.
