import { Controller, Get } from '@nestjs/common';
import { HelloResponse } from '../shared/HelloResponse';

@Controller('api')
export class AppController {
  @Get('hello')
  getHello(): HelloResponse {
    return {
      text: 'Hello world',
    };
  }
}
