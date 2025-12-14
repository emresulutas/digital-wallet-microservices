import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './users/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 1. Kullanıcı Listesini Getir
  @Get('users') 
  getUsers(): Promise<User[]> {
    return this.appService.getAllUsers();
  }

  // (createFakeUser metodunu SİLDİK, artık gerek yok)

  // 2. Para Transferi
  @Post('transfer')
  makeTransfer(@Body() body: any) {
    return this.appService.processTransfer(body);
  }
}