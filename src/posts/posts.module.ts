import { Module } from '@nestjs/common';
import { PostService } from './posts.service';
import { CartResolver, PostResolver, ScrapResolver } from './posts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Scrap } from './entities/scrap.entity';
import { Cart } from './entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Scrap, Cart])],
  providers: [PostResolver, PostService, ScrapResolver, CartResolver],
})
export class PostsModule {}
