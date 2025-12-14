import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- SWAGGER AYARLARI BURADA ---
  const config = new DocumentBuilder()
    .setTitle('Dijital Cüzdan API') // Başlık
    .setDescription('Mikroservis Mimari Test Paneli') // Açıklama
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 'api' yolunda çalışacak
  // -------------------------------

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger UI is available at: http://localhost:3000/api`);
}
bootstrap();