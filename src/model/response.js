export class Response {
    constructor(xhr) {
        this.statusCode = xhr.status
        this.state = xhr.readyState
        this.text = xhr.responseText
        this.content = xhr.response
        this.headers = xhr.getAllResponseHeaders()
        this.statusText = xhr.statusText
        this.url = xhr.responseURL
        this.type = xhr.responseType
    }

    json() {
        return JSON.parse(this.text)
    }
}