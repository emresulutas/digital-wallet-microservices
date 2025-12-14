import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users/user.entity';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Uygulama başlarken bu fonksiyon otomatik çalışır
  async onModuleInit() {
    // 1. İçeride kaç kişi var say
    const count = await this.userRepository.count();
    
    // 2. Eğer kimse yoksa (count 0 ise), bu 5 kişiyi ekle
    if (count === 0) {
      console.log('Veritabanı boş, 5 adet test müşterisi ekleniyor...');
      
      const users = [
        { fullName: 'Emre Can Sulutaş', email: 'emre@bank.com', password: '123', balance: 150000 },
        { fullName: 'Ayşe Demir',   email: 'ayse@bank.com',  password: '123', balance: 24000 },
        { fullName: 'Mehmet Kaya',  email: 'mehmet@bank.com', password: '123', balance: 5000 },
        { fullName: 'Zeynep Çelik', email: 'zeynep@bank.com', password: '123', balance: 100000 }, 
        { fullName: 'Can Yıldız',   email: 'can@bank.com',   password: '123', balance: 500 }
      ];

      // Hepsini kaydet
      for (const u of users) {
        await this.userRepository.save(this.userRepository.create(u));
      }
      
      console.log('✅ 5 Müşteri Başarıyla Eklendi!');
    }
  }

  // Tüm kullanıcıları getir
  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Transfer İşlemi
  async processTransfer(data: any) {
    console.log('Gelen Transfer İsteği:', data);

    // 1. SÖZLEŞME KONTROLÜ (Pact Senaryosu)
    // Eğer sayı değilse (örn: "bin lira") hata fırlat!
    if (typeof data.amount !== 'number') {
      throw new BadRequestException('SÖZLEŞME İHLALİ: Tutar (amount) sayı tipinde olmalıdır! "bin tl" kabul edilmez.');
    }

    // 2. KULLANICIYI BUL (Dinamik Senaryo)
    // Eğer userId gönderildiyse gerçek işlem yapalım
    if (data.userId) {
      const user = await this.userRepository.findOneBy({ id: data.userId });
      
      if (!user) {
        throw new BadRequestException('Böyle bir müşteri bulunamadı!');
      }

      // Veritabanından gelen bakiye bazen string olabilir, sayıya çevirelim
      const currentBalance = parseFloat(user.balance.toString());

      // 3. BAKİYE KONTROLÜ
      if (currentBalance < data.amount) {
        throw new BadRequestException(`Yetersiz Bakiye! Mevcut paranız: ${currentBalance} TL`);
      }

      // 4. İŞLEMİ YAP (Parayı düş)
      user.balance = currentBalance - data.amount;
      await this.userRepository.save(user);

      return {
        status: 'success',
        message: `İşlem Başarılı! Sayın ${user.fullName}, hesabınızdan ${data.amount} TL çekildi.`,
        oldBalance: currentBalance,
        newBalance: user.balance,
        transactionId: Date.now(),
      };
    }

    // Eğer ID yoksa (eski testler için) basit dönüş yap
    return { status: 'success', amount: data.amount };
  }

  // (Eski createTestUser fonksiyonu - sınıfın İÇİNDE kalmalı)
  async createTestUser() { 
    return null; 
  } 
}