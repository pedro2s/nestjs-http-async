import { Injectable } from "@nestjs/common";
import axios,{ AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig} from 'axios';

export interface CustomAxiosRequestConfig extends CreateAxiosDefaults{
    enableLogging?: boolean;
}

@Injectable()
export class HttpAsyncService {
    private axiosInstance: AxiosInstance;

    constructor(private readonly options: CustomAxiosRequestConfig) {
        const { enableLogging, ...config } = this.options;
        this.axiosInstance = axios.create(config);

        if(enableLogging) {
            this.axiosInstance.interceptors.request.use(this.handleRequest);
            this.axiosInstance.interceptors.response.use(this.handleResponse, this.handleErrorResponse);
        }

    }

    private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
        console.log(`HTTP Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    }

    private handleResponse(response: AxiosResponse): AxiosResponse {
        console.log(`HTTP Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.baseURL}${response.config.url}`);
        return response;
    }

    private handleErrorResponse(error: AxiosError): Promise<AxiosError> {
        console.error(`HTTP Error: ${error.message}`, { error });
        return Promise.reject(error);
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get<T>(url, config);
    }

    async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.post<T>(url, data, config);
    }

    async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.put<T>(url, data, config);
    }

    async patch<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.patch<T>(url, data, config);
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.delete<T>(url, config);
    }
}