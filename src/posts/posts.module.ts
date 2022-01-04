import { Module } from '@nestjs/common';
import { PostService } from './posts.service';
import { PostResolver, ScrapResolver } from './posts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Scrap } from './entities/scrap.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Scrap])],
  providers: [PostResolver, PostService, ScrapResolver],
})
export class PostsModule {}
