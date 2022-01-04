import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

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

  @Field(() => [CartItemOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: CartItemOption[];

  @RelationId((cart: Cart) => cart.user)
  customerId: number;
}
