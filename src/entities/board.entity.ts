import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import UsersEntity from "./auth.entity";

@Entity({ name: 'board' })
export default class BoardEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string;

  @Column({ name: 'title', type: 'varchar', length: 120, nullable: false})
  name: string;

  @Column({ name: 'content', type: 'text', nullable: false })
  price: number;

  @Column({name: 'img', type: 'varchar', nullable: false })
  img: string;

  @Column({name:"info", type: 'varchar', nullable: false})
  info: string;

  @Column({name:"material", type: "varchar", nullable: false})
  material: string;

  @CreateDateColumn({type: "timestamp", name: 'createdAt'})
  createdAt: Date

  @ManyToOne(() => UsersEntity, user => user.board, {onDelete: 'CASCADE'})
  user: UsersEntity;

}
