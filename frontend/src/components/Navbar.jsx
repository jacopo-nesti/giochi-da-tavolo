import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'

// Collegamenti della navigazione
const links = [
    ['/', 'Home'],
    ['/games', 'Tutti i giochi'],
    ['/games/new', 'Aggiungi gioco'],
    ['/games/edit', 'Aggiorna gioco'],
    ['/categories', 'Categorie']
]

export default function Navbar() {

    const [open, setOpen] = useState(false)

    const location = useLocation()

    return (
        <header className="site-header">

            <nav
                className="container nav-inner"
                aria-label="Navigazione principale"
            >

                {/* LOGO */}
                <Link
                    className="brand"
                    to="/"
                    onClick={() => setOpen(false)}
                >
                    <span
                        className="brand-die"
                        aria-hidden="true"
                    >
                        ⚄
                    </span>

                    <span>
                        BoardGame <strong>Manager</strong>
                    </span>
                </Link>

                {/* PULSANTE MENU MOBILE */}
                <button
                    className="menu-toggle"
                    type="button"
                    aria-label="Apri menu"
                    aria-controls="main-menu"
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* COLLEGAMENTI */}
                <div
                    id="main-menu"
                    className={`nav-links ${open ? 'open' : ''}`}
                >

                    {links.map(([to, label]) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/' || to === '/games'}
                            className={({ isActive }) =>
                                `nav-link ${
                                    isActive ||
                                    (
                                        to === '/games/edit' &&
                                        location.pathname.endsWith('/edit')
                                    )
                                        ? 'active'
                                        : ''
                                }`
                            }
                            onClick={() => setOpen(false)}
                        >
                            {label}
                        </NavLink>
                    ))}

                </div>

            </nav>

        </header>
    )
}
