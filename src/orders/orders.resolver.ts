import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateCartInput, CreateCartOutput } from './dto/create-cart.dto';
import { MyCartInput, MyCartOutput } from './dto/my-cart.dto';
import { Cart } from './entities/cart.entity';
import { OrderService } from './orders.service';

@Resolver()
export class OrderResolver {}

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => CreateCartOutput)
  @Role(['Any'])
  async createCart(
    @AuthUser() user: User,
    @Args('input') toggleCartInput: CreateCartInput,
  ): Promise<CreateCartOutput> {
    return this.orderService.createCartItem(user, toggleCartInput);
  }

  @Query(() => MyCartOutput)
  @Role(['Any'])
  myCart(
    @AuthUser() user: User,
    @Args('input') myCartInput: MyCartInput,
  ): Promise<MyCartOutput> {
    return this.orderService.myCart(user, myCartInput);
  }
}
