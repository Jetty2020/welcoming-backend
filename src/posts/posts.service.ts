import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostInput, CreatePostOutput } from './dtos/create-post.dto';
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
}
