import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Cart } from '../entities/cart.entity';

@InputType()
export class MyCartInput extends PaginationInput {}

@ObjectType()
export class MyCartOutput extends PaginationOutput {
  @Field(() => [Cart], { nullable: true })
  carts?: Cart[];
}
