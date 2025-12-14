import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // Ortam değişkenlerini yükle
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      // DÜZELTME BURADA:
      // parseInt parantezinin içine || '5432' ekledik.
      // Böylece undefined gelme ihtimalini yok ettik.
      port: parseInt(process.env.DB_PORT || '5432'), 
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASS || 'password123',
      database: process.env.DB_NAME || 'banking_db',
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}