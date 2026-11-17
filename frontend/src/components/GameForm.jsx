import { useEffect, useRef, useState } from 'react'

import { api } from '../services/api'
import Status from './Status'

// Valori iniziali del form
const blank = {
    name: '',
    description: '',
    min_players: '1',
    max_players: '4',
    duration_minutes: '30',
    min_age: '8',
    release_year: '',
    image_url: '',
    category_id: ''
}

// Campi da convertire in numeri
const numeric = [
    'min_players',
    'max_players',
    'duration_minutes',
    'min_age',
    'release_year',
    'category_id'
]

export default function GameForm({ initialGame, onSave, submitLabel }) {

    // STATO DEL FORM
    const [form, setForm] = useState(
        initialGame
            ? Object.fromEntries(
                Object.keys(blank).map(
                    k => [k, initialGame[k] ?? '']
                )
            )
            : blank
    )

    // STATO DELLE CATEGORIE
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')

    // STATO DEL SALVATAGGIO
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const lock = useRef(false)

    // CARICAMENTO CATEGORIE
    useEffect(() => {

        let active = true

        api.categories()
            .then(c => active && setCategories(c))
            .catch(e => active && setLoadError(e.message))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }

    }, [])

    // AGGIORNAMENTO CAMPI DEL FORM
    const set = (key, value) => {

        setForm(f => ({
            ...f,
            [key]: value
        }))

        setError('')
        setSuccess('')
    }

    // INVIO DEL FORM
    const submit = async e => {

        e.preventDefault()

        if (lock.current) {
            return
        }

        // Preparazione dei dati
        const data = {
            ...form,
            name: form.name.trim(),
            description: form.description.trim(),
            image_url: form.image_url.trim() || null
        }

        // Conversione campi numerici
        for (const key of numeric) {
            data[key] = Number(form[key])
        }

        // Validazione nome
        if (!data.name || data.name.length > 150) {
            return setError(
                'Il nome è obbligatorio e non può superare 150 caratteri.'
            )
        }

        // Validazione campi numerici
        if (
            numeric.some(key => !Number.isInteger(data[key])) ||
            data.min_players < 1 ||
            data.max_players < data.min_players ||
            data.duration_minutes < 1 ||
            data.min_age < 1 ||
            data.category_id < 1 ||
            data.release_year < 1900 ||
            data.release_year > 2030
        ) {
            return setError(
                'Controlla giocatori, durata, età, anno (1900–2030) e categoria.'
            )
        }

        // Validazione URL immagine
        if (data.image_url) {

            try {
                const url = new URL(data.image_url)

                if (
                    !['http:', 'https:'].includes(url.protocol) ||
                    data.image_url.length > 500
                ) {
                    throw Error()
                }

            } catch {
                return setError(
                    'Inserisci un URL immagine HTTP o HTTPS valido (massimo 500 caratteri).'
                )
            }
        }

        // Blocco invii multipli
        lock.current = true

        setSaving(true)
        setError('')
        setSuccess('')

        // SALVATAGGIO
        try {
            const result = await onSave(data)

            setSuccess(
                result?.message || 'Gioco salvato con successo.'
            )

            if (!initialGame) {
                setForm(blank)
            }

        } catch (err) {
            setError(err.message)

        } finally {
            lock.current = false
            setSaving(false)
        }
    }

    // GESTIONE CARICAMENTO ED ERRORI
    if (loading || loadError) {
        return (
            <Status
                loading={loading}
                error={loadError}
            />
        )
    }

    return (
        <form
            className="game-form"
            onSubmit={submit}
        >

            <p className="form-hint">
                I campi contrassegnati con * sono obbligatori.
            </p>

            <div className="form-grid">

                {/* NOME */}
                <label className="full">
                    Nome del gioco *

                    <input
                        className="form-control"
                        required
                        maxLength="150"
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                    />
                </label>

                {/* DESCRIZIONE */}
                <label className="full">
                    Descrizione

                    <textarea
                        className="form-control"
                        rows="4"
                        value={form.description}
                        onChange={e => set('description', e.target.value)}
                    />
                </label>

                {/* GIOCATORI MINIMI */}
                <label>
                    Giocatori minimi *

                    <input
                        className="form-control"
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={form.min_players}
                        onChange={e => set('min_players', e.target.value)}
                    />
                </label>

                {/* GIOCATORI MASSIMI */}
                <label>
                    Giocatori massimi *

                    <input
                        className="form-control"
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={form.max_players}
                        onChange={e => set('max_players', e.target.value)}
                    />
                </label>

                {/* DURATA */}
                <label>
                    Durata (minuti) *

                    <input
                        className="form-control"
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={form.duration_minutes}
                        onChange={e => set('duration_minutes', e.target.value)}
                    />
                </label>

                {/* ETÀ MINIMA */}
                <label>
                    Età minima *

                    <input
                        className="form-control"
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={form.min_age}
                        onChange={e => set('min_age', e.target.value)}
                    />
                </label>

                {/* ANNO DI PUBBLICAZIONE */}
                <label>
                    Anno di pubblicazione *

                    <input
                        className="form-control"
                        type="number"
                        min="1900"
                        max="2030"
                        step="1"
                        required
                        value={form.release_year}
                        onChange={e => set('release_year', e.target.value)}
                    />
                </label>

                {/* CATEGORIA */}
                <label>
                    Categoria *

                    <select
                        className="form-select"
                        required
                        value={form.category_id}
                        onChange={e => set('category_id', e.target.value)}
                    >
                        <option value="">
                            Scegli una categoria
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

                {/* URL IMMAGINE */}
                <label className="full">
                    URL immagine
                    {' '}
                    <span className="optional">
                        (facoltativo)
                    </span>

                    <input
                        className="form-control"
                        type="url"
                        maxLength="500"
                        placeholder="https://..."
                        value={form.image_url}
                        onChange={e => set('image_url', e.target.value)}
                    />
                </label>

            </div>

            {/* MESSAGGIO DI ERRORE */}
            {error && (
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {/* MESSAGGIO DI SUCCESSO */}
            {success && (
                <div
                    className="alert alert-success"
                    role="status"
                >
                    {success}
                </div>
            )}

            {/* PULSANTE SALVATAGGIO */}
            <button
                className="btn-western"
                type="submit"
                disabled={saving || !categories.length}
            >
                {saving
                    ? 'Salvataggio…'
                    : submitLabel}
            </button>

            {!categories.length && (
                <p className="form-hint">
                    Crea prima una categoria per poter salvare un gioco.
                </p>
            )}

        </form>
    )
}
