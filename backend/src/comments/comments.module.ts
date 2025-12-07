import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsEntity } from './comments.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CommentsEntity])],
  providers: [CommentsService],
  controllers: [CommentsController]
})
export class CommentsModule {}
