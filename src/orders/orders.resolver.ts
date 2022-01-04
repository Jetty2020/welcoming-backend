import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateCartInput, CreateCartOutput } from './dto/create-cart.dto';
import { CreateOrderInput, CreateOrderOutput } from './dto/create-order.dto';
import { DeleteCartInput, DeleteCartOutput } from './dto/delete-cart.dto';
import { MyCartInput, MyCartOutput } from './dto/my-cart.dto';
import { OrdersNumOutput } from './dto/orders-num.dto';
import { UpdateCartInput, UpdateCartOutput } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { OrderService } from './orders.service';

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => CreateOrderOutput)
  @Role(['Any'])
  async createOrder(
    @AuthUser() user: User,
    @Args('input') createOrderInput: CreateOrderInput,
  ): Promise<CreateCartOutput> {
    return this.orderService.createOrder(user, createOrderInput);
  }

  @Query(() => OrdersNumOutput)
  @Role(['Any'])
  async OrdersNum(@AuthUser() user: User): Promise<CreateCartOutput> {
    return this.orderService.ordersNum(user);
  }
}

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => CreateCartOutput)
  @Role(['Any'])
  async createCart(
    @AuthUser() user: User,
    @Args('input') createCartInput: CreateCartInput,
  ): Promise<CreateCartOutput> {
    return this.orderService.createCartItem(user, createCartInput);
  }

  @Query(() => MyCartOutput)
  @Role(['Any'])
  myCart(
    @AuthUser() user: User,
    @Args('input') myCartInput: MyCartInput,
  ): Promise<MyCartOutput> {
    return this.orderService.myCart(user, myCartInput);
  }

  @Mutation(() => UpdateCartOutput)
  @Role(['Any'])
  async updateCart(
    @AuthUser() user: User,
    @Args('input') updateCartInput: UpdateCartInput,
  ): Promise<UpdateCartOutput> {
    return this.orderService.updateCartItem(user, updateCartInput);
  }

  @Mutation(() => DeleteCartOutput)
  @Role(['Any'])
  async deleteCart(
    @AuthUser() user: User,
    @Args('input') deleteCartInput: DeleteCartInput,
  ): Promise<DeleteCartOutput> {
    return this.orderService.deleteCartItem(user, deleteCartInput);
  }
}
