import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Order } from './order.entity';

@InputType('CartChoiceInputType', { isAbstract: true })
@ObjectType()
export class CartItemChoice {
  @Field(() => String)
  name: string;

  @Field(() => String)
  select: string;
}
@InputType('CartOptionInputType', { isAbstract: true })
@ObjectType()
export class CartItemOption {
  @Field(() => [CartItemChoice], { nullable: true })
  choices?: CartItemChoice[];

  @Field(() => Int)
  num: number;

  @Field(() => Int)
  price: number;
}

export enum OrderStatus {
  OnCart = 'OnCart',
  Pending = 'Pending',
  Paid = 'Paid',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('CartInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Cart extends CoreEntity {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.carts, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.carts, {
    onDelete: 'CASCADE',
  })
  post: Post;

  @Field(() => Order)
  @ManyToOne(() => Order, (order) => order.carts, {
    onDelete: 'CASCADE',
  })
  order?: Order;

  @Field(() => [CartItemOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: CartItemOption[];

  @RelationId((cart: Cart) => cart.user)
  customerId: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.OnCart })
  @Field(() => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
