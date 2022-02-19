import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class SendEmailInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  code: string;
}

@ObjectType()
export class SendEmailOutput extends CoreOutput {}
