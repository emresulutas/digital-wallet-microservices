import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs'; // RxJS işlemi için gerekli

@Injectable()
export class AppService {
  // DİKKAT: Burası değişti!
  // Docker'daysak ortam değişkenini al, yoksa localhost kullan.
  private bankUrl = process.env.BANK_URL || 'http://localhost:3001';

  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'API Gateway Çalışıyor!';
  }

  // 1. Kullanıcı Listesi İsteği
  async getUsers() {
    try {
      // Adresi dinamik yaptık: this.bankUrl
      const response = await firstValueFrom(
        this.httpService.get(`${this.bankUrl}/users`)
      );
      return response.data;
    } catch (error) {
      // Hata olursa düzgün gösterelim
      throw new HttpException(
        error.response?.data || 'Bankaya ulaşılamadı',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 2. Transfer İsteği
  async transfer(data: any) {
    try {
      // Adresi dinamik yaptık: this.bankUrl
      const response = await firstValueFrom(
        this.httpService.post(`${this.bankUrl}/transfer`, data)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Transfer başarısız',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}