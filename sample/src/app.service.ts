import { Inject, Injectable } from '@nestjs/common';
import { HttpAsyncService } from '@pedro2s/nestjs-http-async';

@Injectable()
export class AppService {
  constructor(
    @Inject('CustomHttpService')
    private readonly httpService: HttpAsyncService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async fethcData() {
    const resonse = await this.httpService.get(
      'https://jsonplaceholder.typicode.com/todos/1',
    );

    return resonse.data;
  }
}
