import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CoreEntity } from 'src/common/entities/core.entity';
import { IsEnum, IsInt, IsString, Length } from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';
import { Post } from 'src/posts/entities/post.entity';
import { Scrap } from 'src/posts/entities/scrap.entity';
import { Cart } from 'src/orders/entities/cart.entity';
import { Comment } from 'src/posts/entities/comment.entity';
import { Nested } from 'src/posts/entities/nested.entity';

export enum UserRole {
  Client = 'Client',
  Seller = 'Seller',
  Manager = 'Manager',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  @Length(2, 15)
  nickname: string;

  @Column({ select: false })
  @Field(() => String)
  @IsString()
  password: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  address: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.seller)
  posts: Post[];

  @Field(() => [Scrap])
  @OneToMany(() => Scrap, (scrap) => scrap.post)
  scraps: Scrap[];

  @Field(() => [Cart])
  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @Field(() => Int)
  @IsInt()
  cartsNum: number;

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.user, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  comments: Comment[];

  @Field(() => [Nested])
  @OneToMany(() => Nested, (nested) => nested.user, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  nesteds: Nested[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
