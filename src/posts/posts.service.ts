import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CONFIG_PAGES } from 'src/common/common.constants';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
import { ILike, MoreThanOrEqual, Repository } from 'typeorm';
import { AllPostsInput, AllPostsOutput } from './dtos/allPosts.dto';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from './dtos/create-comment.dto';
import {
  CreateNestedInput,
  CreateNestedOutput,
} from './dtos/create-nested.dto';
import { CreatePostInput, CreatePostOutput } from './dtos/create-post.dto';
import {
  DeleteCommentInput,
  DeleteCommentOutput,
} from './dtos/delete-comment.dto';
import { DeletePostInput, DeletePostOutput } from './dtos/delete-post.dto';
import { EditPostInput, EditPostOutput } from './dtos/edit-post.dto';
import {
  GetTodayDealPostInput,
  GetTodayDealPostOutput,
} from './dtos/get-todayDeal-post.dto';
import { PostDetailInput, PostDetailOutput } from './dtos/post-detail.dto';
import {
  SearchPostByCategoryInput,
  SearchPostByCategoryOutput,
} from './dtos/search-post-category.dto';
import { ToggleScrapInput, ToggleScrapOutput } from './dtos/toggle-scrap.dto';
import { Comment } from './entities/comment.entity';
import { Nested } from './entities/nested.entity';
import { Post } from './entities/post.entity';
import { Scrap } from './entities/scrap.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly posts: Repository<Post>,

    @InjectRepository(Scrap)
    private readonly scraps: Repository<Scrap>,

    @InjectRepository(Comment)
    private readonly comments: Repository<Comment>,

    @InjectRepository(Nested)
    private readonly nesteds: Repository<Nested>,

    private readonly jwtService: JwtService,
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

  async findPostById({ postId }: PostDetailInput): Promise<PostDetailOutput> {
    try {
      const post = await this.posts.findOne(postId);
      if (!post) {
        return {
          ok: false,
          error: '게시물을 찾을 수 없습니다.',
        };
      }
      return {
        ok: true,
        post,
      };
    } catch {
      return {
        ok: false,
        error: '게시물을 불러오는데 실패했습니다.',
      };
    }
  }

  async getAllPosts({ order, page }: AllPostsInput): Promise<AllPostsOutput> {
    try {
      let posts, totalResults;
      if (order === 0) {
        [posts, totalResults] = await this.posts.findAndCount({
          skip: (page - 1) * CONFIG_PAGES,
          take: CONFIG_PAGES,
          order: {
            createdAt: 'DESC',
          },
        });
      }
      // else if (order === 1) {
      //   [posts, totalResults] = await this.posts.findAndCount({
      //     skip: (page - 1) * CONFIG_PAGES,
      //     take: CONFIG_PAGES,
      //     order: {
      //       scrapsNum: 'DESC',
      //     },
      //   });
      // } else {
      //   [posts, totalResults] = await this.posts.findAndCount({
      //     skip: (page - 1) * CONFIG_PAGES,
      //     take: CONFIG_PAGES,
      //     order: {
      //       createdAt: 'DESC',
      //     },
      //   });
      // }
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

  async getTodayDealPost({
    page,
    postNum,
  }: GetTodayDealPostInput): Promise<GetTodayDealPostOutput> {
    try {
      let nums = 0;
      if (postNum) {
        nums = postNum;
      } else {
        nums = CONFIG_PAGES;
      }
      const [posts, totalResults] = await this.posts.findAndCount({
        where: {
          todayDeal: MoreThanOrEqual(1),
        },
        skip: (page - 1) * nums,
        take: nums,
        order: {
          createdAt: 'DESC',
        },
      });
      return {
        ok: true,
        posts,
        totalResults,
        totalPages: Math.ceil(totalResults / nums),
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

  async checkIScrap(ctx: any, post: Post) {
    try {
      let decoded;
      if (!ctx.token) return false;
      else decoded = this.jwtService.verify(ctx.token.toString());
      const exist = await this.scraps.find({
        where: {
          post,
          user: {
            id: decoded?.id,
          },
        },
      });
      return Boolean(exist.length);
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

  async createComment(
    writer: User,
    { content, postId }: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    try {
      const newComment = this.comments.create({ content });
      newComment.user = writer;

      const post = await this.posts.findOne(postId);
      if (!post) {
        return {
          ok: false,
          error: '게시물이 존재하지 않습니다.',
        };
      }
      newComment.post = post;
      await this.comments.save(newComment);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '댓글 생성에 실패했습니다.',
      };
    }
  }

  async createNested(
    writer: User,
    { content, commentId }: CreateNestedInput,
  ): Promise<CreateNestedOutput> {
    try {
      const newNested = this.nesteds.create({ content });
      newNested.user = writer;

      const comment = await this.comments.findOne(commentId);
      if (!comment) {
        return {
          ok: false,
          error: '댓글이 존재하지 않습니다.',
        };
      }
      newNested.parent = comment;
      await this.nesteds.save(newNested);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '대댓글 생성에 실패했습니다.',
      };
    }
  }

  async deleteComment(
    writer: User,
    { commentId, nestedId }: DeleteCommentInput,
  ): Promise<DeleteCommentOutput> {
    if (commentId) {
      const comment = await this.comments.findOne(commentId);
      if (!comment) {
        return {
          ok: false,
          error: '댓글이 존재하지 않습니다.',
        };
      }
      await this.comments.delete(commentId);
    } else if (nestedId) {
      const nested = await this.nesteds.findOne(nestedId);
      if (!nested) {
        return {
          ok: false,
          error: '대댓글이 존재하지 않습니다.',
        };
      }
      await this.nesteds.delete(nestedId);
    }
    try {
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '댓글 삭제에 실패했습니다.',
      };
    }
  }
}
