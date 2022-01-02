import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
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
  async scrapsNum(@Parent() post: Post) {
    return this.postService.getScrapsNumber(post);
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

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => ToggleCartOutput)
  @Role(['Any'])
  async toggleCart(
    @AuthUser() authUser: User,
    @Args('input') toggleCartInput: ToggleCartInput,
  ): Promise<ToggleCartOutput> {
    return this.postService.toggleCart(authUser, toggleCartInput);
  }
}
