import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class UpdateCartInput {
  @Field(() => Number)
  cartId: number;

  @Field(() => Number)
  nthOption: number;

  @Field(() => Number)
  num: number;
}

@ObjectType()
export class UpdateCartOutput extends CoreOutput {}
