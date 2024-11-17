class ApiResponse {
  constructor(statusCode, message = "success", data) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode > 400;
    this.data = data;
  }
}

module.exports = ApiResponse;
