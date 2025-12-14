import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  // YENİ EKLENEN KISIM: BAKİYE
  // default: 0 dedik ki, yeni biri eklenirse parası 0 olsun.
  @Column({ type: 'decimal', default: 0 }) 
  balance: number;
}