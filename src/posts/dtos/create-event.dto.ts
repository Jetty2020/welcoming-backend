import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Event } from '../entities/event.entity';

@InputType()
export class CreateEventInput extends PartialType(Event) {}

@ObjectType()
export class CreateEventOutput extends CoreOutput {
  @Field(() => Int)
  eventId?: number;
}
