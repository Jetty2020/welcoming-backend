import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Comment } from '../entities/comment.entity';

@InputType()
export class CreateCommentInput extends PickType(PartialType(Comment), [
  'content',
]) {
  @Field(() => Number)
  postId: number;
}

@ObjectType()
export class CreateCommentOutput extends CoreOutput {}
