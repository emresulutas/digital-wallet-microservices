import { TransferDto } from './transfer.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('client-users')
  getUsers() {
    // Eskiden: getUsersFromBank() idi
    // Şimdi: getUsers() oldu
    return this.appService.getUsers();
  }

  @Post('transfer')
makeTransfer(@Body() body: TransferDto) { // <-- Burası 'any' yerine 'TransferDto' oldu
  return this.appService.transfer(body);
}
}