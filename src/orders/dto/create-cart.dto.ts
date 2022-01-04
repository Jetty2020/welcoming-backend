import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Cart } from '../entities/cart.entity';

@InputType()
export class CreateCartInput extends PickType(PartialType(Cart), ['options']) {
  @Field(() => Number)
  postId: number;
}

@ObjectType()
export class CreateCartOutput extends CoreOutput {
  @Field(() => Boolean)
  already?: boolean;
}
