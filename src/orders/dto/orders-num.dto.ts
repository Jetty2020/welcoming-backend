import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class OrdersNumInput {}

@ObjectType()
export class OrdersNumOutput extends CoreOutput {
  @Field(() => [Number])
  numArr?: number[];
}
