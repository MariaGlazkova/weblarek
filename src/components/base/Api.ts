type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) {
            return response.json();
        } else {
            // Проверяем, является ли ответ HTML (начинается с <)
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                return Promise.reject(new Error(`Сервер вернул HTML вместо JSON. Возможно, неправильный URL: ${this.baseUrl}`));
            }
            return response.json()
                .then(data => Promise.reject(data.error ?? response.statusText))
                .catch(() => Promise.reject(new Error(`HTTP ${response.status}: ${response.statusText}`)));
        }
    }

    get<T extends object>(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse<T>);
    }

    post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse<T>);
    }
}
