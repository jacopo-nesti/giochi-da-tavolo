import { useEffect, useRef, useState } from 'react'

import { api } from '../services/api'
import Status from '../components/Status'

export default function CategoriesPage() {

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const [editing, setEditing] = useState(null)
    const [name, setName] = useState('')
    const [notes, setNotes] = useState('')
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(null)

    const lock = useRef(false)

    // RECUPERO CATEGORIE
    const load = async () => {

        setLoading(true)
        setError('')

        try {
            setCategories(await api.categories())

        } catch (e) {
            setError(e.message)

        } finally {
            setLoading(false)
        }
    }

    // CARICAMENTO INIZIALE
    useEffect(() => {
        let active = true

        api.categories()
            .then(c => active && setCategories(c))
            .catch(e => active && setError(e.message))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [])

    // AVVIO MODIFICA CATEGORIA
    const startEdit = c => {

        setEditing(c.id)
        setName(c.name)
        setNotes(c.notes || '')
        setError('')
        setMessage('')

        document
            .getElementById('category-form')
            ?.scrollIntoView({ behavior: 'smooth' })
    }

    // RESET FORM
    const reset = () => {
        setEditing(null)
        setName('')
        setNotes('')
    }

    // SALVATAGGIO CATEGORIA (POST / PUT)
    const save = async e => {

        e.preventDefault()

        if (lock.current) {
            return
        }

        if (!name.trim() || name.trim().length > 150) {
            return setError(
                'Il nome è obbligatorio e non può superare 150 caratteri.'
            )
        }

        lock.current = true

        setSaving(true)
        setError('')
        setMessage('')

        try {
            const result = editing
                ? await api.updateCategory(editing, {
                    name: name.trim(),
                    notes: notes.trim() || null
                })
                : await api.createCategory({
                    name: name.trim(),
                    notes: notes.trim() || null
                })

            setMessage(result.message || 'Categoria salvata.')

            reset()

            setCategories(await api.categories())

        } catch (e) {
            setError(e.message)

        } finally {
            lock.current = false
            setSaving(false)
        }
    }

    // ELIMINAZIONE CATEGORIA
    const remove = async c => {

        if (!window.confirm(`Eliminare la categoria "${c.name}"?`)) {
            return
        }

        setDeleting(c.id)
        setError('')
        setMessage('')

        try {
            await api.deleteCategory(c.id)

            setCategories(await api.categories())

            setMessage('Categoria eliminata con successo.')

            if (editing === c.id) {
                reset()
            }

        } catch (e) {
            setError(
                e.status === 409 || e.code === 409
                    ? 'Impossibile eliminare la categoria perché è utilizzata da uno o più giochi.'
                    : e.message
            )

        } finally {
            setDeleting(null)
        }
    }

    return (
        <main className="page-wrap container">

            {/* INTESTAZIONE */}
            <div className="page-heading">

                <span className="eyebrow">
                    METTI ORDINE
                </span>

                <h1>Categorie</h1>

                <p>
                    Organizza il catalogo secondo i tuoi gusti.
                </p>

            </div>

            <div className="categories-layout">

                {/* ELENCO CATEGORIE */}
                <section className="paper-panel">

                    <h2>Le tue categorie</h2>

                    <Status
                        loading={loading}
                        error={loading ? '' : error}
                        onRetry={load}
                        empty={
                            !loading && !error && !categories.length
                                ? 'Non ci sono ancora categorie.'
                                : null
                        }
                    />

                    {!loading && !!categories.length && (
                        <ul className="category-list">

                            {categories.map(c => (
                                <li key={c.id}>

                                    <div>
                                        <strong>{c.name}</strong>

                                        <p>
                                            {c.notes || 'Nessuna nota'}
                                        </p>
                                    </div>

                                    <div className="category-actions">

                                        <button
                                            type="button"
                                            className="btn-outline-western"
                                            onClick={() => startEdit(c)}
                                        >
                                            Modifica
                                        </button>

                                        <button
                                            type="button"
                                            className="btn-outline-western danger"
                                            disabled={deleting === c.id}
                                            onClick={() => remove(c)}
                                        >
                                            {deleting === c.id
                                                ? 'Elimino…'
                                                : 'Elimina'}
                                        </button>

                                    </div>

                                </li>
                            ))}

                        </ul>
                    )}

                </section>

                {/* FORM CATEGORIA */}
                <section
                    className="paper-panel"
                    id="category-form"
                >

                    <h2>
                        {editing
                            ? 'Modifica categoria'
                            : 'Aggiungi categoria'}
                    </h2>

                    <form
                        onSubmit={save}
                        className="category-form"
                    >

                        {/* NOME CATEGORIA */}
                        <label>
                            Nome *

                            <input
                                className="form-control"
                                required
                                maxLength="150"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </label>

                        {/* NOTE CATEGORIA */}
                        <label>
                            Note <span className="optional">(facoltative)</span>

                            <textarea
                                className="form-control"
                                rows="4"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            />
                        </label>

                        {/* MESSAGGI */}
                        {error && (
                            <div
                                className="alert alert-danger"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}

                        {message && (
                            <div
                                className="alert alert-success"
                                role="status"
                            >
                                {message}
                            </div>
                        )}

                        {/* PULSANTI */}
                        <div className="action-row">

                            <button
                                type="submit"
                                className="btn-western"
                                disabled={saving}
                            >
                                {saving
                                    ? 'Salvataggio…'
                                    : editing
                                        ? 'Salva modifiche'
                                        : 'Aggiungi categoria'}
                            </button>

                            {editing && (
                                <button
                                    type="button"
                                    className="btn-outline-western"
                                    onClick={reset}
                                >
                                    Annulla
                                </button>
                            )}

                        </div>

                    </form>

                </section>

            </div>

        </main>
    )
}
