import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UsersResolver {
  @Query((returns) => Boolean)
  user(): Boolean {
    return true;
  }
}
