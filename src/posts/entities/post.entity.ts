import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Cart } from 'src/orders/entities/cart.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Comment } from './comment.entity';
import { Scrap } from './scrap.entity';

@InputType('PostChoiceInputType', { isAbstract: true })
@ObjectType()
export class PostChoice {
  @Field(() => String)
  name: string;
  @Field(() => Int, { nullable: true })
  extra?: number;
}
@InputType('PostOptionInputType', { isAbstract: true })
@ObjectType()
export class PostOption {
  @Field(() => String)
  name: string;
  @Field(() => [PostChoice], { nullable: true })
  choices?: PostChoice[];
}
@InputType('PostInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Post extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  @Length(2, 100)
  title: string;

  @Field(() => Int)
  @Column()
  @IsInt()
  ori_price: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  @IsInt()
  selling_price: number;

  @Field(() => Int)
  @Column()
  @IsInt()
  stock: number;

  @Field(() => String)
  @Column()
  @IsString()
  brand: string;

  @Field(() => String)
  @Column()
  @IsString()
  category: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  @IsInt()
  detail_00: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  @IsInt()
  detail_01: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  @IsInt()
  detail_02: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  @IsInt()
  detail_03: number;

  @Field(() => String)
  @Column()
  @IsString()
  desc: string;

  @Field(() => String)
  @Column()
  @IsString()
  thumbnail: string;

  @Field(() => Int)
  @Column({ default: 0 })
  @IsInt()
  event: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  seller: User;

  @RelationId((post: Post) => post.seller)
  sellerId: number;

  @Field(() => [Scrap])
  @OneToMany(() => Scrap, (scrap) => scrap.post)
  scraps: Scrap[];

  @Field(() => Int)
  @IsInt()
  scrapsNum: number;

  @Field(() => Boolean)
  @IsBoolean()
  isScrap: boolean;

  @Field(() => [Cart])
  @OneToMany(() => Cart, (cart) => cart.post)
  carts: Cart[];

  @Field(() => [PostOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: PostOption[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.post, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  comments: Comment[];
}
