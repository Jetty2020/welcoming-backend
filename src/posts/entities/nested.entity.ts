import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
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

  @Field(() => Comment)
  @ManyToOne(() => Comment, (comment) => comment.nested, {
    onDelete: 'CASCADE',
  })
  parent: Comment;
}
