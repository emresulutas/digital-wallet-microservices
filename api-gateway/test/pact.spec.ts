import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import path from 'path';
import axios from 'axios';

// 1. Tüketici ve Sağlayıcı isimlerini tanımlıyoruz
const provider = new PactV3({
  consumer: 'ApiGateway',
  provider: 'CoreBankingService',
  dir: path.resolve(process.cwd(), 'pacts'), // Sözleşme dosyası (JSON) buraya kaydedilecek
});

describe('Pact Testi: ApiGateway -> CoreBanking', () => {
  it('Banka kullanici listesini dogru formatta donmeli', async () => {
    
    // 2. Beklentimizi (Interaction) Tanımlıyoruz
    provider
      .given('Veritabaninda kullanicilar var') // Durum (State)
      .uponReceiving('Kullanici listesi istegi') // Ne yapiyoruz?
      .withRequest({
        method: 'GET',
        path: '/users', // Hangi adrese gidiyoruz?
      })
      .willRespondWith({
        status: 200, // Basarili cevap kodu
        body: MatchersV3.eachLike({
          // Bekledigimiz veri formati (Sözleşme burası!)
          id: MatchersV3.integer(1),      // ID kesinlikle sayi olmali
          fullName: MatchersV3.string('Emre Can'), // Isim kesinlikle yazi olmali
          email: MatchersV3.string('test@test.com') // Email kesinlikle yazi olmali
        }),
      });

    // 3. Testi Calistiriyoruz
    await provider.executeTest(async (mockServer) => {
      // Pact bizim icin sahte bir banka sunucusu (Mock Server) ayaga kaldiriyor
      // Biz gercek bankaya degil, bu sahte sunucuya istek atiyoruz
      const response = await axios.get(`${mockServer.url}/users`);
      
      // Cevap Pact'in bekledigi gibi mi?
      expect(response.data[0].fullName).toEqual('Emre Can');
      expect(response.status).toEqual(200);
    });
  });
});