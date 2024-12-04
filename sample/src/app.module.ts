import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpAsyncModule } from '@pedro2s/nestjs-http-async';

@Module({
  imports: [
    HttpAsyncModule.forFeature({
      serviceName: 'CustomHttpService',
      config: {
        enableLogging: true,
        baseURL: 'https://jsonplaceholder.typicode.com',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
