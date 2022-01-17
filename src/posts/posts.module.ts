import { Module } from '@nestjs/common';
import { PostService } from './posts.service';
import { CommentResolver, PostResolver, ScrapResolver } from './posts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Scrap } from './entities/scrap.entity';
import { Comment } from './entities/comment.entity';
import { Nested } from './entities/nested.entity';
import { Event } from './entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Scrap, Comment, Nested, Event])],
  providers: [PostResolver, PostService, ScrapResolver, CommentResolver],
})
export class PostsModule {}
