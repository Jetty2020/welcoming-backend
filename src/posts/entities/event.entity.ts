import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Post } from './post.entity';

@InputType('EventInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Event extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  @Length(2, 100)
  title: string;

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.event)
  posts: Post[];

  @Field(() => String)
  @Column()
  @IsString()
  thumbnail: string;

  @Field(() => String)
  @Column()
  @IsString()
  desc: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  carouselTitle: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  carouselImg: string;

  @Field(() => Int)
  @Column({ default: 0 })
  @IsInt()
  scrapsNum: number;

  @Field(() => Int)
  @Column({ default: 0 })
  @IsInt()
  sharesNum: number;
}
