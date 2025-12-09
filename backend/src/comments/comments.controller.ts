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
    async create(
        @Body('username') username: string,
        @Body('content') content: string,
    ) {
        return this.service.create(username, content);
    }
}
