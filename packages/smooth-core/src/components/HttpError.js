function getMessage(statusCode) {
  switch (statusCode) {
    case 404:
      return 'Not found'
    default:
      return `HTTP Error ${statusCode}`
  }
}

export class HTTPError extends Error {
  constructor({ statusCode }) {
    super(getMessage(statusCode))
    this.statusCode = statusCode
  }
}
