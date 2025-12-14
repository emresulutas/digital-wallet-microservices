import { Verifier } from '@pact-foundation/pact';
import path from 'path';

describe('Pact Doğrulaması: CoreBankingService', () => {
  it('Tüketici (ApiGateway) ile olan sözleşmeyi doğrulamalı', async () => {
    
    // 1. Doğrulayıcıyı (Verifier) Ayarlıyoruz
    const verifier = new Verifier({
      provider: 'CoreBankingService', // Bizim adımız
      providerBaseUrl: 'http://localhost:3000', // Bizim adresimiz (Çalışıyor olması lazım!)
      
      // 2. Sözleşme Dosyasının Yeri (Yan dükkandan alıyoruz)
      pactUrls: [
        path.resolve(process.cwd(), '../api-gateway/pacts/ApiGateway-CoreBankingService.json'),
      ],
      
      // 3. Logları görelim ki hata varsa anlayalım
      logLevel: 'info', 
    });

    // 4. Testi Çalıştır
    // Bu kod, sözleşmedeki istekleri tek tek bizim sunucuya (localhost:3000) atar
    // ve gelen cevapları kontrol eder.
    await verifier.verifyProvider().then(output => {
        console.log('Pact Doğrulaması Başarılı!');
        console.log(output);
    });
  });
});