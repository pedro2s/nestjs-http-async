import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('todos/:id')
  fethcData(@Param('id', ParseIntPipe) id: number) {
    return this.appService.fethcData(id);
  }

  @Post('todos')
  post(@Body() data: any) {
    return this.appService.post(data);
  }
}
