import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class ToggleCartInput {
  @Field(() => Number)
  postId: number;
}

@ObjectType()
export class ToggleCartOutput extends CoreOutput {}
