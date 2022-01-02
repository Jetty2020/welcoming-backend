import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Post } from '../entities/post.entity';

@InputType()
export class SearchPostByCategoryInput extends PaginationInput {
  @Field(() => String, { nullable: true })
  categoryQuery: string;

  @Field(() => Int, { nullable: true })
  detail_00?: number;

  @Field(() => Int, { nullable: true })
  detail_01?: number;

  @Field(() => Int, { nullable: true })
  detail_02?: number;

  @Field(() => Int, { nullable: true })
  detail_03?: number;
}

@ObjectType()
export class SearchPostByCategoryOutput extends PaginationOutput {
  @Field(() => [Post], { nullable: true })
  posts?: Post[];
}
