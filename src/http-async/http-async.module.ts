import { DynamicModule, Module, Provider } from "@nestjs/common";
import { CustomAxiosRequestConfig, HttpAsyncService } from "./http-async.service";

export interface HttpAsyncModuleOptionsAsync {
    imports?: any[];
    useFactory: (...args: any[]) => Promise<CustomAxiosRequestConfig> | CustomAxiosRequestConfig;
    inject?: any[];
}

export interface HttpAsyncForFeatureOptionsAsync {
    serviceName: string;
    imports?: any[];
    useFactory: (...args: any[]) => Promise<CustomAxiosRequestConfig> | CustomAxiosRequestConfig;
    inject?: any[];
}

@Module({})
export class HttpAsyncModule {
    private static getDynamicHttpAsyncModule(options: {serviceName: string, config?: CustomAxiosRequestConfig}): DynamicModule {
        const httpServeice = new HttpAsyncService(options?.config ?? {});
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

    static forFeature(options: {serviceName: string, config?: CustomAxiosRequestConfig} | {serviceName: string, config: CustomAxiosRequestConfig}[]): DynamicModule {
        if (Array.isArray(options)) {
            return options.reduce<DynamicModule>((acc, option) => {
                const httpService = new HttpAsyncService(option?.config ?? {});
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

    static forRoot(options?: CustomAxiosRequestConfig): DynamicModule {
        const httpServeice = new HttpAsyncService(options ?? {});

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

    static forRootAsync(options: HttpAsyncModuleOptionsAsync): DynamicModule {
        const providers: Provider[] = [
            {
                provide: HttpAsyncService,
                useFactory: async (...args) => {
                    const config = await options.useFactory(...args);
                    return new HttpAsyncService(config);
                },
                inject: options.inject || [],
            },
        ];

        return {
            module: HttpAsyncModule,
            imports: options.imports || [],
            providers,
            exports: [HttpAsyncService],
        };
    }

    static forFeatureAsync(options: HttpAsyncForFeatureOptionsAsync | HttpAsyncForFeatureOptionsAsync[]): DynamicModule {
        if (Array.isArray(options)) {
            const providers: Provider[] = options.map(option => ({
                provide: option.serviceName,
                useFactory: async (...args) => {
                    const config = await option.useFactory(...args);
                    return new HttpAsyncService(config);
                },
                inject: option.inject || [],
            }));

            const imports = options.reduce<any[]>((acc, option) => {
                if (option.imports) {
                    acc.push(...option.imports);
                }
                return acc;
            }, []);

            const uniqueImports = [...new Set(imports)];


            return {
                module: HttpAsyncModule,
                imports: uniqueImports,
                providers,
                exports: options.map(o => o.serviceName),
            };
        } else {
            const providers: Provider[] = [
                {
                    provide: options.serviceName,
                    useFactory: async (...args) => {
                        const config = await options.useFactory(...args);
                        return new HttpAsyncService(config);
                    },
                    inject: options.inject || [],
                },
            ];

            return {
                module: HttpAsyncModule,
                imports: options.imports || [],
                providers,
                exports: [options.serviceName],
            };
        }
    }
}
