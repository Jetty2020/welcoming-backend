import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Nested } from '../entities/nested.entity';

@InputType()
export class CreateNestedInput extends PickType(PartialType(Nested), [
  'content',
]) {
  @Field(() => Number)
  commentId: number;
}

@ObjectType()
export class CreateNestedOutput extends CoreOutput {}
