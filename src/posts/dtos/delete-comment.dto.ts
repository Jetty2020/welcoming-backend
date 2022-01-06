import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteCommentInput {
  @Field(() => Number, { nullable: true })
  commentId: number;

  @Field(() => Number, { nullable: true })
  nestedId: number;
}

@ObjectType()
export class DeleteCommentOutput extends CoreOutput {}
