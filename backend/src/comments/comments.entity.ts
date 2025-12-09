import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommentsEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({ type: 'text' })
    content:string;

    @Column({ type: 'text' })
    username:string;

    @CreateDateColumn()
    createdAt:Date;

}
