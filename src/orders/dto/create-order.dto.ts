import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Cart } from '../entities/cart.entity';

@InputType()
export class CreateOrderInput extends PickType(Cart, ['status']) {
  @Field(() => [Number])
  cartIds: number[];

  @Field(() => String)
  address: string;
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {
  @Field(() => Number)
  orderId?: number;
}
