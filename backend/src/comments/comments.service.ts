import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsEntity } from './comments.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentsEntity)
        private readonly repo: Repository<CommentsEntity>,
    ) {}

    async create(username:string, content: string): Promise<CommentsEntity> {
        const c = this.repo.create({ username ,content });
        return this.repo.save(c);
    }

    async findAll(): Promise<CommentsEntity[]> {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }
}
