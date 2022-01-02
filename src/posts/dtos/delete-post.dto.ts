import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeletePostInput {
  @Field(() => Number)
  postId: number;
}

@ObjectType()
export class DeletePostOutput extends CoreOutput {}
