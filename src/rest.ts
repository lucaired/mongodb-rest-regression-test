import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class RestClient {
    private client: AxiosInstance;

    constructor(bearerToken: string, baseURL: string) {
        this.client = axios.create({
            baseURL,
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        });
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }
}