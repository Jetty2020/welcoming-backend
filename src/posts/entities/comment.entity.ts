import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Nested } from './nested.entity';
import { Post } from './post.entity';

@InputType('CommentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Comment extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  @Length(0, 100)
  content: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  post: Post;

  @Field(() => [Nested])
  @OneToMany(() => Nested, (nested) => nested.parent, {
    nullable: true,
    eager: true,
  })
  nested: Nested[];
}
