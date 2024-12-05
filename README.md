# nestjs-http-async

`nestjs-http-async` is a package that provides an asynchronous HTTP client for NestJS applications. It offers the same functionality as NestJS's built-in `HttpService`, but with a key difference: all methods return Promises instead of Observables.

## Features

- Drop-in replacement for NestJS's `HttpService`
- All methods return Promises for easier async/await usage
- Supports all HTTP methods (GET, POST, PUT, DELETE, etc.)
- Configurable via NestJS's dependency injection system

## Installation

To install the package, run the following command in your project directory:

```bash
npm install @pedro2s/nestjs-http-async axios
```

## Usage

1. Import the `HttpAsyncModule` in your `app.module.ts` or any other module where you want to use it:

```typescript
import { Module } from '@nestjs/common';
import { HttpAsyncModule } from 'nestjs-http-async';

@Module({
  imports: [HttpAsyncModule.forRoot()],
  // ...
})
export class AppModule {}
```

2. Inject the `HttpAsyncService` in your service or controller:

```typescript
import { Injectable } from '@nestjs/common';
import { HttpAsyncService } from 'nestjs-http-async';

@Injectable()
export class MyService {
  constructor(private readonly httpAsyncService: HttpAsyncService) {}

  async fetchData() {
    try {
      const response = await this.httpAsyncService.get('https://api.example.com/data');
      return response.data;
    } catch (error) {
      // Handle error
    }
  }
}
```

## API

The `HttpAsyncService` provides the following methods:

- `get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>`
- `post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>`
- `put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>`
- `delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>`
- `patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>`
- `head<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>`
- `options<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>`

All methods return a Promise that resolves with an AxiosResponse object.

## Configuration

1. You can configure the `HttpAsyncModule` by using the `forRoot` method:

```typescript
import { Module } from '@nestjs/common';
import { HttpAsyncModule } from 'nestjs-http-async';

@Module({
  imports: [
    HttpAsyncModule.forRoot({
      enableLogging: true
      timeout: 5000,
      maxRedirects: 5,
      // Other Axios configuration options
    }),
  ],
  // ...
})
export class AppModule {}
```

2. You can configure the `HttpAsyncModule` by using the `forFeature` method:

```typescript
import { Module } from '@nestjs/common';
import { HttpAsyncModule } from 'nestjs-http-async';

@Module({
  imports: [
    HttpAsyncModule.forFeature({
      serviceName: 'CustomHttpService',
      config: {
        enableLogging: true,
        baseURL: 'https://api.example.com',
        // Other Axios configuration options
      },
    }),
  ],
  // ...
})
export class AppModule {}
```
or
```typescript
import { Module } from '@nestjs/common';
import { HttpAsyncModule } from 'nestjs-http-async';

@Module({
  imports: [
    HttpAsyncModule.forFeature([
      {
        serviceName: 'JsonPlaceholder',
        config: {
           enableLogging: true,
           baseURL: 'https://jsonplaceholder.typicode.com',
           // Other Axios configuration options
        },
      },
      {
        serviceName: 'AdviceSlip',
        baseURL: 'https://api.adviceslip.com/advice'
        // ...
      }
    ]),
  ],
  // ...
})
export class AppModule {}
```
If your `HttpAsyncModule` configuration is via the `forFeature` method
inject `HttpAsyncService` into your service or controller like this::

```typescript
import { Injectable } from '@nestjs/common';
import { HttpAsyncService } from 'nestjs-http-async';

@Injectable()
export class MyService {
  constructor(
    @Inject('CustomHttpService')
    private readonly httpAsyncService: HttpAsyncService) {}

  async fetchData() {
    try {
      const response = await this.httpAsyncService.get('/data');
      return response.data;
    } catch (error) {
      // Handle error
    }
  }
}
```

## Differences from NestJS HttpService

The main difference between `nestjs-http-async` and NestJS's `HttpService` is the return type of the methods:

- `HttpService` methods return `Observable<AxiosResponse<T>>`
- `HttpAsyncService` methods return `Promise<AxiosResponse<T>>`

This change allows for easier use with async/await syntax and eliminates the need for RxJS operators in most cases.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
