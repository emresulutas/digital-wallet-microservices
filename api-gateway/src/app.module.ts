import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static'; // <--- YENİ: HTML sunmak için ekledik
import { join } from 'path'; // <--- YENİ: Klasör yolunu bulmak için standart kütüphane
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    HttpModule,
    // AŞAĞIDAKİ KISIM YENİ EKLENDİ:
    // Bu ayar diyor ki: "Projeden bir klasör yukarı çık, 'public' klasörünü bul ve içindekileri yayınla"
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}