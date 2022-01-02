import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CONFIG_PAGES } from 'src/common/common.constants';
import { User } from 'src/users/entities/user.entity';
import { ILike, MoreThanOrEqual, Repository } from 'typeorm';
import { CreatePostInput, CreatePostOutput } from './dtos/create-post.dto';
import { DeletePostInput, DeletePostOutput } from './dtos/delete-post.dto';
import { EditPostInput, EditPostOutput } from './dtos/edit-post.dto';
import {
  SearchPostByCategoryInput,
  SearchPostByCategoryOutput,
} from './dtos/search-post-category.dto';
import { ToggleCartInput, ToggleCartOutput } from './dtos/toggle-cart.dto';
import { ToggleScrapInput, ToggleScrapOutput } from './dtos/toggle-scrap.dto';
import { Cart } from './entities/cart.entity';
import { Post } from './entities/post.entity';
import { Scrap } from './entities/scrap.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly posts: Repository<Post>,
    @InjectRepository(Scrap)
    private readonly scraps: Repository<Scrap>,
    @InjectRepository(Cart)
    private readonly carts: Repository<Cart>,
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
        order: {
          createdAt: 'DESC',
        },
      });
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

  async editPost(
    seller: User,
    editPostInput: EditPostInput,
  ): Promise<EditPostOutput> {
    try {
      const post = await this.posts.findOne(editPostInput.postId);
      if (!post) {
        return {
          ok: false,
          error: '게시물이 존재하지 않습니다.',
        };
      }
      if (seller.id !== post.sellerId) {
        return {
          ok: false,
          error: '게시물을 편집할 권한이 없습니다.',
        };
      }
      await this.posts.save([
        {
          id: editPostInput.postId,
          ...editPostInput,
        },
      ]);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '게시물을 편집하는데 실패했습니다.',
      };
    }
  }

  async deletePost(
    seller: User,
    { postId }: DeletePostInput,
  ): Promise<DeletePostOutput> {
    try {
      const post = await this.posts.findOne(postId);
      if (!post) {
        return {
          ok: false,
          error: '게시물이 존재하지 않습니다.',
        };
      }
      if (seller.id !== post.sellerId) {
        return {
          ok: false,
          error: '게시물을 삭제할 권한이 없습니다.',
        };
      }
      await this.posts.delete(postId);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '게시물을 삭제하는데 실패했습니다.',
      };
    }
  }

  async getScrapsNumber(post: Post) {
    try {
      const [_, totalScraps] = await this.scraps.findAndCount({
        where: {
          post,
        },
      });
      return totalScraps;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async toggleScrap(
    user: User,
    toggleScrapInput: ToggleScrapInput,
  ): Promise<ToggleScrapOutput> {
    try {
      const post = await this.posts.findOne(toggleScrapInput.postId);
      if (!post) {
        return {
          ok: false,
          error: '게시물이 존재하지 않습니다.',
        };
      }
      const scrap = await this.scraps.findOne({
        where: {
          user,
          post,
        },
      });
      if (scrap) {
        await this.scraps.delete(scrap.id);
      } else {
        await this.scraps.save(this.scraps.create({ user, post }));
      }
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Toggle scrap에 실패했습니다.',
      };
    }
  }

  async toggleCart(
    user: User,
    toggleCartInput: ToggleCartInput,
  ): Promise<ToggleCartOutput> {
    try {
      const post = await this.posts.findOne(toggleCartInput.postId);
      if (!post) {
        return {
          ok: false,
          error: '게시물이 존재하지 않습니다.',
        };
      }
      const cart = await this.carts.findOne({
        where: {
          user,
          post,
        },
      });
      if (cart) {
        await this.carts.delete(cart.id);
      } else {
        await this.carts.save(this.carts.create({ user, post }));
      }
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Toggle cart에 실패했습니다.',
      };
    }
  }
}
