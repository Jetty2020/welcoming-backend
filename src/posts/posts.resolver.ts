import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreatePostInput, CreatePostOutput } from './dtos/create-post.dto';
import { EditPostInput, EditPostOutput } from './dtos/edit-post.dto';
import {
  SearchPostByCategoryInput,
  SearchPostByCategoryOutput,
} from './dtos/search-post-category.dto';
import { Post } from './entities/post.entity';
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

  @Query(() => SearchPostByCategoryOutput)
  searchPostByCategory(
    @Args('input') searchPostInput: SearchPostByCategoryInput,
  ): Promise<SearchPostByCategoryOutput> {
    return this.postService.searchPostByCategory(searchPostInput);
  }

  @Mutation(() => EditPostOutput)
  @Role(['Any'])
  editPost(
    @AuthUser() owner: User,
    @Args('input') editPostInput: EditPostInput,
  ): Promise<EditPostOutput> {
    return this.postService.editPost(owner, editPostInput);
  }
}
