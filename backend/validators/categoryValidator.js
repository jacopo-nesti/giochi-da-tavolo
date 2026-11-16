function validateCategory(category) {

    const {name} = category
    const notes = category.notes ?? null

    // Validazione name categoria
    if (typeof name !== "string" || name.trim() === "") {
        return "Il nome della categoria è obbligatorio"
    }

    // Validazione lunghezza name
    if (name.trim().length > 150) {
        return "Il nome non può superare 150 caratteri"
    }

    // Validazione notes (facoltativo)
    if (notes !== null && typeof notes !== "string") {
        return "Le note devono essere testuali"
    }

   // Tutte le validazioni superate 
    return null
}

module.exports = validateCategory
