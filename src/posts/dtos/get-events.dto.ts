import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Event } from '../entities/event.entity';

@InputType()
export class GetEventsInput extends PaginationInput {
  @Field(() => Int, { defaultValue: 0 })
  eventNum: number;
}

@ObjectType()
export class GetEventsOutput extends PaginationOutput {
  @Field(() => [Event], { nullable: true })
  events?: Event[];
}
