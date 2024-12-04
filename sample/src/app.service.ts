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

  async fethcData(id: number) {
    const resonse = await this.httpService.get(`/todos/${id}`);

    return resonse.data;
  }

  async post(data: any) {
    const response = await this.httpService.post('/todos', data);

    return response.data;
  }
}
