class ApiResponseDTO {
    constructor(success, message, code, data = null) {
        this.success = success
        this.message = message
        this.code = code

        if (data != null) {
            this.data = data
        }
    }
}

module.exports = ApiResponseDTO
