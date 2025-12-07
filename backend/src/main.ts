import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { DataSource } from 'typeorm';
import { CommentsEntity } from './comments/comments.entity';

async function bootstrap() {
  // Reset DB file before Nest/TypeORM initializes (optional environment parameter RESET_AND_SEED)
  if (process.env.RESET_AND_SEED === 'true') {
    try {
      const dbPath = join(process.cwd(), 'database.sqlite');
      if (existsSync(dbPath)) {
        unlinkSync(dbPath);
        console.log('[seed] removed existing database file:', dbPath);
      } else {
        console.log('[seed] no existing DB file to remove');
      }
    } catch (err) {
      console.error('[seed] failed to remove DB file', err);
    }
  }

  const app = await NestFactory.create(AppModule);

  // optional: enable CORS in dev
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors();
  }
  await app.init();

  // After TypeORM is initialized by the AppModule, seed demo comments
  if (process.env.RESET_AND_SEED === 'true') {
    try {
      const dataSource = app.get(DataSource);
      const commentsRepo = dataSource.getRepository(CommentsEntity);
      const seedComments = [
        {
          content: 'Welcome to the demo — this comment is seeded.',
        },
        {
          content: 'This is very awesome comment I guess',
        },
        {
          content: 'Try posting new comments — they will be dropped on restart.',
        },
      ];

      await commentsRepo.save(seedComments as any);

      console.log('[seed] inserted', seedComments.length, 'seed comments');
    } catch (err) {
      console.error('[seed] seeding failed', err);
    }
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server listening on port ${port}`);
}
bootstrap();
