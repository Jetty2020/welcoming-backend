import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Post } from '../entities/post.entity';

@InputType()
export class AllPostsInput extends PaginationInput {
  @Field(() => Int, { defaultValue: 0 })
  order: number;
}

@ObjectType()
export class AllPostsOutput extends PaginationOutput {
  @Field(() => [Post], { nullable: true })
  posts?: Post[];
}
