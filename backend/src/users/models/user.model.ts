import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserModel {
  @PrimaryColumn()
  address: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'boolean' })
  isMediator: boolean;

  @Column({ type: 'varchar', length: 255 })
  photoUri: string;

  @Column({ type: 'varchar', length: 255 })
  bio: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  portfolioUri: string;

  @Column({ type: 'bigint' })
  createdAt: number;
}
