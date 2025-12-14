import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import * as path from 'path';
import axios from 'axios';

// 1. Pact Kurulumu
const provider = new PactV3({
  consumer: 'ApiGateway',
  provider: 'CoreBanking',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('Pact Sözleşme Testi', () => {
  
  // SENARYO 1: Başarılı Transfer
  it('Success: Geçerli veri (Sayı) ile transfer', () => {
    provider
      .given('transfer servisi çalışıyor')
      .uponReceiving('geçerli bir para transfer isteği')
      .withRequest({
        method: 'POST',
        path: '/transfer',
        headers: { 'Content-Type': 'application/json' },
        body: { amount: 500 }, 
      })
      .willRespondWith({
        status: 201, // Başarılı
        body: MatchersV3.like({
          status: 'success',
          amount: 500,
        }),
      });

    return provider.executeTest(async (mockServer) => {
      const response = await axios.post(`${mockServer.url}/transfer`, { amount: 500 });
      expect(response.status).toEqual(201);
    });
  });

  // SENARYO 2: Hatalı Transfer (Senin HTML'deki Kırmızı Senaryo)
  it('Failure: Hatalı veri (String) ile transfer', () => {
    provider
      .given('transfer servisi çalışıyor')
      .uponReceiving('hatalı bir transfer isteği (metin içeren)')
      .withRequest({
        method: 'POST',
        path: '/transfer',
        headers: { 'Content-Type': 'application/json' },
        body: { amount: "beş yüz tl" }, // KURAL İHLALİ: String gönderiyoruz
      })
      .willRespondWith({
        status: 400, // KURAL: Banka bunu reddetmeli (Bad Request)
        // Bankadan dönen hata mesajının yapısını bekliyoruz (Opsiyonel ama iyi olur)
      });

    return provider.executeTest(async (mockServer) => {
      try {
        // Hatalı istek atıyoruz
        await axios.post(`${mockServer.url}/transfer`, { amount: "beş yüz tl" });
      } catch (error) {
        // Beklentimiz hata almaktı, o yüzden burası başarılı sayılır
        expect(error.response.status).toEqual(400); 
      }
    });
  });

});