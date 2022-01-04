import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Cart } from './cart.entity';

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.carts, {
    onDelete: 'CASCADE',
  })
  user: User;

  @RelationId((order: Order) => order.user)
  customerId: number;

  @Field(() => [Cart])
  @OneToMany(() => Cart, (cart) => cart.order, {
    onDelete: 'CASCADE',
  })
  carts?: Cart[];

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  address: string;
}
