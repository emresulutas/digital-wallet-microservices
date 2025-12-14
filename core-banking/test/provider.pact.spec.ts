import { Test } from '@nestjs/testing';
import { Verifier } from '@pact-foundation/pact';
import * as path from 'path';
import { AppModule } from '../src/app.module'; // App Modülünü import et
import { INestApplication } from '@nestjs/common';

describe('Pact Provider Doğrulaması', () => {
  let app: INestApplication;

  // Testten önce gerçek uygulamayı başlat
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.listen(3001); // 3001 Portunda dinle
  });

  // Test bitince uygulamayı kapat
  afterAll(async () => {
    await app.close();
  });

  it('Gateway ile olan sözleşmeyi doğrula', async () => {
    // Sözleşme dosyasının nerede olduğunu buluyoruz
    // Core Banking klasöründen bir üst klasöre çıkıp api-gateway'e giriyoruz
    const pactFile = path.resolve(process.cwd(), '../api-gateway/pacts/ApiGateway-CoreBanking.json');

    // Doğrulayıcıyı çalıştır
    const output = await new Verifier({
      provider: 'CoreBanking', // Bizim adımız
      providerBaseUrl: 'http://localhost:3001', // Uygulamamızın adresi
      pactUrls: [pactFile], // Sözleşme dosyasının yolu
      stateHandlers: {
        // Sözleşmede "given" kısmında yazdığımız durumları buraya tanımlıyoruz
        'transfer servisi çalışıyor': async () => {
          console.log('Transfer servisi hazır...');
          return Promise.resolve('Servis Hazır');
        },
      },
    }).verifyProvider();

    console.log('Pact Doğrulama Sonucu:', output);
  });
});