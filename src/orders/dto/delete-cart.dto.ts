import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteCartInput {
  @Field(() => Number)
  cartId: number;

  @Field(() => Number, { nullable: true })
  nthOption?: number;
}

@ObjectType()
export class DeleteCartOutput extends CoreOutput {}
