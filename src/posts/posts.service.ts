import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CONFIG_PAGES } from 'src/common/common.constants';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
import { ILike, IsNull, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { AllPostsInput, AllPostsOutput } from './dtos/allPosts.dto';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from './dtos/create-comment.dto';
import { CreateEventInput, CreateEventOutput } from './dtos/create-event.dto';
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
import { GetEventsInput, GetEventsOutput } from './dtos/get-events.dto';
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
import { Event } from './entities/event.entity';
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

    @InjectRepository(Event)
    private readonly events: Repository<Event>,

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
        error: '????????? ????????? ??????????????????.',
      };
    }
  }

  async findPostById({ postId }: PostDetailInput): Promise<PostDetailOutput> {
    try {
      const post = await this.posts.findOne(postId);
      if (!post) {
        return {
          ok: false,
          error: '???????????? ?????? ??? ????????????.',
        };
      }
      return {
        ok: true,
        post,
      };
    } catch {
      return {
        ok: false,
        error: '???????????? ??????????????? ??????????????????.',
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
      } else if (order === 1) {
        [posts, totalResults] = await this.posts.findAndCount({
          skip: (page - 1) * CONFIG_PAGES,
          take: CONFIG_PAGES,
          order: {
            scrapsNum: 'DESC',
            createdAt: 'DESC',
          },
        });
      } else {
        [posts, totalResults] = await this.posts.findAndCount({
          skip: (page - 1) * CONFIG_PAGES,
          take: CONFIG_PAGES,
          order: {
            commentsNum: 'DESC',
            createdAt: 'DESC',
          },
        });
      }
      return {
        ok: true,
        posts,
        totalResults,
        totalPages: Math.ceil(totalResults / CONFIG_PAGES),
      };
    } catch {
      return { ok: false, error: '???????????? ??????????????? ??????????????????.' };
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
      return { ok: false, error: '???????????? ??????????????? ??????????????????.' };
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
      return { ok: false, error: '???????????? ??????????????? ??????????????????.' };
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
          error: '???????????? ???????????? ????????????.',
        };
      }
      if (seller.id !== post.sellerId) {
        return {
          ok: false,
          error: '???????????? ????????? ????????? ????????????.',
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
        error: '???????????? ??????????????? ??????????????????.',
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
          error: '???????????? ???????????? ????????????.',
        };
      }
      if (seller.id !== post.sellerId) {
        return {
          ok: false,
          error: '???????????? ????????? ????????? ????????????.',
        };
      }
      await this.posts.delete(postId);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '???????????? ??????????????? ??????????????????.',
      };
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
          error: '???????????? ???????????? ????????????.',
        };
      }
      const scrap = await this.scraps.findOne({
        where: {
          user,
          post,
        },
      });
      const [_, count] = await this.scraps.findAndCount({
        where: {
          post,
        },
      });
      if (scrap) {
        post.scrapsNum = count - 1;
        await this.scraps.delete(scrap.id);
      } else {
        post.scrapsNum = count + 1;
        await this.scraps.save(this.scraps.create({ user, post }));
      }
      await this.posts.save(post);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Toggle scrap??? ??????????????????.',
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
      const [_, commentCount] = await this.comments.findAndCount({
        where: {
          post,
        },
      });
      post.commentsNum = commentCount + 1;
      await this.posts.save(post);
      if (!post) {
        return {
          ok: false,
          error: '???????????? ???????????? ????????????.',
        };
      }
      newComment.post = post;
      await this.comments.save(newComment);
      return {
        ok: true,
        commentId: newComment.id,
      };
    } catch {
      return {
        ok: false,
        error: '?????? ????????? ??????????????????.',
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
          error: '????????? ???????????? ????????????.',
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
        error: '????????? ????????? ??????????????????.',
      };
    }
  }

  async deleteComment(
    writer: User,
    { commentId, nestedId }: DeleteCommentInput,
  ): Promise<DeleteCommentOutput> {
    if (commentId) {
      const comment = await this.comments.findOne(commentId, {
        relations: ['post'],
      });
      const post = await this.posts.findOne(comment.post.id);
      post.commentsNum -= 1;
      await this.posts.save(post);
      if (!comment) {
        return {
          ok: false,
          error: '????????? ???????????? ????????????.',
        };
      }
      await this.comments.delete(commentId);
    } else if (nestedId) {
      const nested = await this.nesteds.findOne(nestedId);
      if (!nested) {
        return {
          ok: false,
          error: '???????????? ???????????? ????????????.',
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
        error: '?????? ????????? ??????????????????.',
      };
    }
  }

  async createEvent(
    user: User,
    createEventInput: CreateEventInput,
  ): Promise<CreateEventOutput> {
    try {
      if (user.role !== 'Manager') {
        return {
          ok: false,
          error: '????????? ?????? ????????? ????????????.',
        };
      }
      const newEvent = this.events.create(createEventInput);
      await this.events.save(newEvent);
      return {
        ok: true,
        eventId: newEvent.id,
      };
    } catch {
      return {
        ok: false,
        error: '????????? ????????? ??????????????????.',
      };
    }
  }

  async getEvents({
    page,
    eventNum,
  }: GetEventsInput): Promise<GetEventsOutput> {
    try {
      let nums = 0;
      if (eventNum) {
        nums = eventNum;
      } else {
        nums = CONFIG_PAGES;
      }
      const [events, totalResults] = await this.events.findAndCount({
        where: {
          carouselTitle: Not(IsNull()),
        },
        skip: (page - 1) * nums,
        take: nums,
        order: {
          createdAt: 'DESC',
        },
      });
      return {
        ok: true,
        events,
        totalResults,
        totalPages: Math.ceil(totalResults / nums),
      };
    } catch {
      return { ok: false, error: '???????????? ??????????????? ??????????????????.' };
    }
  }
}
