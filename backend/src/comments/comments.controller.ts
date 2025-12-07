import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('api/comments')
export class CommentsController {
    constructor(private readonly service: CommentsService) { }

    @Get()
    async getAll() {
        return this.service.findAll();
    }

    @Post()
    async create(@Body('content') content: string) {
        const comment = await this.service.create(content);
        return comment;
    }
}
