import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class SendEmailInput {
  @Field(() => String)
  email: string;

  @Field(() => Int)
  code: number;
}

@ObjectType()
export class SendEmailOutput extends CoreOutput {}
