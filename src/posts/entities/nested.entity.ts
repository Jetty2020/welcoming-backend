import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Comment } from './comment.entity';

@InputType('NestedInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Nested extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  @Length(0, 100)
  content: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.nesteds, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Field(() => Comment)
  @ManyToOne(() => Comment, (comment) => comment.nested, {
    onDelete: 'CASCADE',
  })
  parent: Comment;
}
