import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

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

  @Field(() => String)
  @Column()
  @IsString()
  detail: string;

  @Field(() => String)
  @Column()
  @IsString()
  desc: string;

  @Field(() => String)
  @Column()
  @IsString()
  thumbnail: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  seller: User;

  @RelationId((post: Post) => post.seller)
  sellerId: number;
}
