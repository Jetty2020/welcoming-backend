import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Post } from '../entities/post.entity';

@InputType()
export class CreatePostInput extends PartialType(Post) {}

@ObjectType()
export class CreatePostOutput extends CoreOutput {
  @Field(() => Int)
  postId?: number;
}
