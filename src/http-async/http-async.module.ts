import { DynamicModule, Module } from "@nestjs/common";
import { CustomAxiosRequestConfig, HttpAsyncService } from "./http-async.service";

@Module({})
export class HttpAsyncModule {
    private static getDynamicHttpAsyncModule(options: {serviceName: string, config: CustomAxiosRequestConfig}): DynamicModule {
        const httpServeice = new HttpAsyncService(options.config);
        const providerName = options.serviceName;
        return {
            module: HttpAsyncModule,
            providers: [
                {
                    provide: providerName,
                    useValue: httpServeice
                }
            ],
            exports: [providerName]
        }
    }

    static forFeature(options: {serviceName: string, config: CustomAxiosRequestConfig} | {serviceName: string, config: CustomAxiosRequestConfig}[]): DynamicModule {
        if (Array.isArray(options)) {
            return options.reduce<DynamicModule>((acc, option) => {
                const httpService = new HttpAsyncService(option.config);
                const providerName = option.serviceName;
                acc.providers?.push({
                    provide: providerName,
                    useValue: httpService
                });
                acc.exports?.push(providerName);
                return acc;
            }, {
                module: HttpAsyncModule,
                providers: [],
                exports: []
            });
        } else {
            return HttpAsyncModule.getDynamicHttpAsyncModule(options);
        }
    }

    static forRoot(options: CustomAxiosRequestConfig): DynamicModule {
        const httpServeice = new HttpAsyncService(options);

        return {
            module: HttpAsyncModule,
            providers: [
                {
                    provide: HttpAsyncService,
                    useValue: httpServeice
                }
            ],
            exports: [HttpAsyncService]
        }
    }
}