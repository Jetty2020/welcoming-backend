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
export class CreatePostInput extends PickType(PartialType(Post), [
  'title',
  'ori_price',
  'selling_price',
  'stock',
  'brand',
  'category',
  'detail_00',
  'detail_01',
  'detail_02',
  'detail_03',
  'thumbnail',
  'desc',
]) {}

@ObjectType()
export class CreatePostOutput extends CoreOutput {
  @Field(() => Int)
  postId?: number;
}
