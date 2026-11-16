const express = require('express')
const app = express()
const PORT = 3000

// Importazione delle routes
const gamesRoutes = require('./routes/gamesRoutes')
const categoriesRoutes = require('./routes/categoriesRoutes')

// Middleware
app.use(express.json())

// Rotta principale
app.get('/', (req, res) => {
    res.send('Giochi da Tavolo')
})

// Collegamento delle routes
app.use('/api/games', gamesRoutes)
app.use('/api/categories', categoriesRoutes)

// Avvio del server
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT)
})
