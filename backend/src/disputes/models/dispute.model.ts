import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// create model
@Entity('disputes')
export class DisputeModel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  address1: string;

  @Column({ type: 'varchar', length: 255 })
  address2: string;

  @Column({ type: 'varchar', length: 255 })
  mediatorAddress: string;

  @Column({ type: 'bigint' })
  createdAt: number;

  @Column({ type: 'bigint' })
  updatedAt: number;
}
