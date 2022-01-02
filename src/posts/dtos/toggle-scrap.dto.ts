import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class ToggleScrapInput {
  @Field(() => Number)
  postId: number;
}

@ObjectType()
export class ToggleScrapOutput extends CoreOutput {}
