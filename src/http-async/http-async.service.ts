import { Injectable, Logger } from "@nestjs/common";
import axios,{ AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios';

export interface CustomAxiosRequestConfig {
    enableLogging?: boolean;
}

@Injectable()
export class HttpAsyncService {
    private axiosInstance: AxiosInstance;
    private readonly logger = new Logger(HttpAsyncService.name);

    constructor(private readonly options: CustomAxiosRequestConfig) {
        this.axiosInstance = axios.create();

        if(options.enableLogging) {
            this.axiosInstance.interceptors.request.use(this.handleRequest);
        }
    }

    private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
        this.logger.debug(`HTTPRequest: ${config.method?.toUpperCase()} ${config.baseURL}`);
        return config;
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get<T>(url, config);
    }
}