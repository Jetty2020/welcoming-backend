import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Post } from '../entities/post.entity';

@InputType()
export class GetTodayDealPostInput extends PaginationInput {
  @Field(() => Int, { defaultValue: 0 })
  postNum: number;
}

@ObjectType()
export class GetTodayDealPostOutput extends PaginationOutput {
  @Field(() => [Post], { nullable: true })
  posts?: Post[];
}
