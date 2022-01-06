import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Post } from '../entities/post.entity';

@InputType()
export class PostDetailInput {
  @Field(() => Int)
  postId: number;
}

@ObjectType()
export class PostDetailOutput extends CoreOutput {
  @Field(() => Post, { nullable: true })
  post?: Post;
}
