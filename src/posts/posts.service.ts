import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CONFIG_PAGES } from 'src/common/common.constants';
import { User } from 'src/users/entities/user.entity';
import { ILike, MoreThanOrEqual, Repository } from 'typeorm';
import { CreatePostInput, CreatePostOutput } from './dtos/create-post.dto';
import {
  SearchPostByCategoryInput,
  SearchPostByCategoryOutput,
} from './dtos/search-post-category.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly posts: Repository<Post>,
  ) {}

  async createPost(
    seller: User,
    createPostInput: CreatePostInput,
  ): Promise<CreatePostOutput> {
    try {
      const newPost = this.posts.create(createPostInput);
      newPost.seller = seller;
      await this.posts.save(newPost);
      return {
        ok: true,
        postId: newPost.id,
      };
    } catch {
      return {
        ok: false,
        error: '게시글 생성에 실패했습니다.',
      };
    }
  }

  async searchPostByCategory({
    categoryQuery,
    detail_00,
    detail_01,
    detail_02,
    detail_03,
    page,
  }: SearchPostByCategoryInput): Promise<SearchPostByCategoryOutput> {
    try {
      const [posts, totalResults] = await this.posts.findAndCount({
        where: {
          category: ILike(`${categoryQuery}%`),
          detail_00: detail_00 || MoreThanOrEqual(0),
          detail_01: detail_01 || MoreThanOrEqual(0),
          detail_02: detail_02 || MoreThanOrEqual(0),
          detail_03: detail_03 || MoreThanOrEqual(0),
        },
        skip: (page - 1) * CONFIG_PAGES,
        take: CONFIG_PAGES,
      });
      console.log(posts, detail_00 || 123);
      return {
        ok: true,
        posts,
        totalResults,
        totalPages: Math.ceil(totalResults / CONFIG_PAGES),
      };
    } catch {
      return { ok: false, error: '게시물을 검색하는데 실패했습니다.' };
    }
  }
}
