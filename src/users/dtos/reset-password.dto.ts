import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class ResetPasswordOutput extends CoreOutput {}

@InputType()
export class ResetPasswordInput extends PartialType(
  PickType(User, ['password', 'email']),
) {}
