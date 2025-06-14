import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('disputes')
export class DisputeModel {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  address1: string;

  @Column({ type: 'varchar', length: 255 })
  address2: string;

  @Column({ type: 'varchar', length: 255 })
  mediatorAddress: string;

  @Column({ type: 'text' })
  problemIPFS: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resolutionIPFS: string | null;


  @Column({ type: 'bigint' })
  totalLockedAmount: string;

  @Column({ type: 'int' })
  status: number;

  @Column({ type: 'boolean' })
  paid1: boolean;

  @Column({ type: 'boolean' })
  paid2: boolean;

  @Column({ type: 'boolean' })
  confirmed1: boolean;

  @Column({ type: 'boolean' })
  confirmed2: boolean;

  @Column({ type: 'bigint' })
  createdAt: number;

  @Column({ type: 'bigint' })
  updatedAt: number;
}
