import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CreatePostInput } from './create-post.dto';

@InputType()
export class EditPostInput extends PartialType(CreatePostInput) {
  @Field(() => Number)
  postId: number;
}

@ObjectType()
export class EditPostOutput extends CoreOutput {}
