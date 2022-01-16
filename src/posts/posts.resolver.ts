import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
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
import { Post } from './entities/post.entity';
import { Scrap } from './entities/scrap.entity';
import { PostService } from './posts.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => CreatePostOutput)
  @Role(['Seller'])
  async createPost(
    @AuthUser() authUser: User,
    @Args('input') createPostInput: CreatePostInput,
  ): Promise<CreatePostOutput> {
    return this.postService.createPost(authUser, createPostInput);
  }

  @Query(() => PostDetailOutput)
  postDetail(
    @Args('input') postDetailInput: PostDetailInput,
  ): Promise<PostDetailOutput> {
    return this.postService.findPostById(postDetailInput);
  }

  @Query(() => SearchPostByCategoryOutput)
  searchPostByCategory(
    @Args('input') searchPostInput: SearchPostByCategoryInput,
  ): Promise<SearchPostByCategoryOutput> {
    return this.postService.searchPostByCategory(searchPostInput);
  }

  @Query(() => GetTodayDealPostOutput)
  getTodayDealPost(
    @Args('input') getTodayDealPostInput: GetTodayDealPostInput,
  ): Promise<GetTodayDealPostOutput> {
    return this.postService.getTodayDealPost(getTodayDealPostInput);
  }

  @Mutation(() => EditPostOutput)
  @Role(['Any'])
  editPost(
    @AuthUser() seller: User,
    @Args('input') editPostInput: EditPostInput,
  ): Promise<EditPostOutput> {
    return this.postService.editPost(seller, editPostInput);
  }

  @Mutation(() => DeletePostOutput)
  @Role(['Any'])
  deletePost(
    @AuthUser() seller: User,
    @Args('input') deletePostInput: DeletePostInput,
  ): Promise<DeletePostOutput> {
    return this.postService.deletePost(seller, deletePostInput);
  }

  @ResolveField(() => Number)
  scrapsNum(@Parent() post: Post) {
    return this.postService.getScrapsNumber(post);
  }

  @ResolveField(() => Boolean)
  isScrap(@Context() ctx: any, @Parent() post: Post) {
    return this.postService.checkIScrap(ctx, post);
  }
}

@Resolver(() => Scrap)
export class ScrapResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => ToggleScrapOutput)
  @Role(['Any'])
  async toggleScrap(
    @AuthUser() authUser: User,
    @Args('input') toggleScrapInput: ToggleScrapInput,
  ): Promise<ToggleScrapOutput> {
    return this.postService.toggleScrap(authUser, toggleScrapInput);
  }
}

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => CreateCommentOutput)
  @Role(['Any'])
  async createComment(
    @AuthUser() authUser: User,
    @Args('input') createcommentInput: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    return this.postService.createComment(authUser, createcommentInput);
  }

  @Mutation(() => CreateNestedOutput)
  @Role(['Any'])
  async createNested(
    @AuthUser() authUser: User,
    @Args('input') createNestedInput: CreateNestedInput,
  ): Promise<CreateCommentOutput> {
    return this.postService.createNested(authUser, createNestedInput);
  }

  @Mutation(() => DeleteCommentOutput)
  @Role(['Any'])
  async deleteComment(
    @AuthUser() authUser: User,
    @Args('input') deletecommentInput: DeleteCommentInput,
  ): Promise<DeleteCommentOutput> {
    return this.postService.deleteComment(authUser, deletecommentInput);
  }
}
