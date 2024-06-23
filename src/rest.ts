import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import _ from 'lodash';

export class RestClient {
    private client: AxiosInstance;

    constructor(bearerToken: string | undefined, baseURL: string) {
        this.client = axios.create({
            baseURL,
            headers: this.makeHeaders(bearerToken),
        });
    }

    private makeHeaders(bearerToken: string | undefined): AxiosRequestConfig['headers'] {
        return _.isNil(bearerToken) ? {} : {
            Authorization: `Bearer ${bearerToken}`,
        };
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }
}