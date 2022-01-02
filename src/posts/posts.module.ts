import { Module } from '@nestjs/common';
import { PostService } from './posts.service';
import { PostResolver } from './posts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostResolver, PostService],
})
export class PostsModule {}
