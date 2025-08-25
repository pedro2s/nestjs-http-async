import { Test } from '@nestjs/testing';
import { describe, it, expect } from 'vitest';
import { HttpAsyncModule } from './http-async.module';
import { HttpAsyncService } from './http-async.service';
import { Module, Injectable } from '@nestjs/common';

// Mock ConfigService
@Injectable()
class ConfigService {
  get(key: string) {
    if (key === 'http.timeout') {
      return 5000;
    }
    return null;
  }
}

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule {}

describe('HttpAsyncModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [HttpAsyncModule.forRoot()],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(HttpAsyncService)).toBeInstanceOf(HttpAsyncService);
  });

  describe('forRootAsync', () => {
    it('should provide HttpAsyncService with useFactory', async () => {
      const module = await Test.createTestingModule({
        imports: [
          HttpAsyncModule.forRootAsync({
            useFactory: () => ({ baseURL: 'https://test.com' }),
          }),
        ],
      }).compile();

      const httpService = module.get(HttpAsyncService);
      expect(httpService).toBeInstanceOf(HttpAsyncService);
      expect((httpService as any).axiosInstance.defaults.baseURL).toBe('https://test.com');
    });

    it('should provide HttpAsyncService with useFactory and inject', async () => {
      const module = await Test.createTestingModule({
        imports: [
          HttpAsyncModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              timeout: configService.get('http.timeout') ?? undefined,
            }),
            inject: [ConfigService],
          }),
        ],
      }).compile();

      const httpService = module.get(HttpAsyncService);
      expect(httpService).toBeInstanceOf(HttpAsyncService);
      expect((httpService as any).axiosInstance.defaults.timeout).toBe(5000);
    });
  });

  describe('forFeatureAsync', () => {
    it('should provide a named HttpAsyncService with useFactory', async () => {
      const module = await Test.createTestingModule({
        imports: [
          HttpAsyncModule.forFeatureAsync({
            serviceName: 'MyHttpService',
            useFactory: () => ({ baseURL: 'https://feature.com' }),
          }),
        ],
      }).compile();

      const httpService = module.get<HttpAsyncService>('MyHttpService');
      expect(httpService).toBeInstanceOf(HttpAsyncService);
      expect((httpService as any).axiosInstance.defaults.baseURL).toBe('https://feature.com');
    });

    it('should provide multiple named HttpAsyncServices', async () => {
        const module = await Test.createTestingModule({
            imports: [
                HttpAsyncModule.forFeatureAsync([
                    {
                        serviceName: 'Service1',
                        imports: [ConfigModule],
                        useFactory: (config: ConfigService) => ({ timeout: config.get('http.timeout') ?? undefined }),
                        inject: [ConfigService],
                    },
                    {
                        serviceName: 'Service2',
                        useFactory: () => ({ baseURL: 'https://service2.com' }),
                    },
                ]),
            ],
        }).compile();

        const service1 = module.get<HttpAsyncService>('Service1');
        const service2 = module.get<HttpAsyncService>('Service2');

        expect(service1).toBeInstanceOf(HttpAsyncService);
        expect((service1 as any).axiosInstance.defaults.timeout).toBe(5000);

        expect(service2).toBeInstanceOf(HttpAsyncService);
        expect((service2 as any).axiosInstance.defaults.baseURL).toBe('https://service2.com');
    });
  });
});