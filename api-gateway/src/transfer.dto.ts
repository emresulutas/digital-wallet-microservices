import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty({ 
    example: 1, 
    description: 'İşlem yapılacak Kullanıcı ID (Örn: Emre Can Sulutaş için ID girin)' 
  })
  userId: number;

  @ApiProperty({ 
    example: 500, 
    description: 'Çekilecek Tutar (Sayı olmalı, yazı yazarsanız hata alırsınız)' 
  })
  amount: any; // 'any' yaptık ki bilerek "yazı" gönderip hatayı gösterebilelim
}