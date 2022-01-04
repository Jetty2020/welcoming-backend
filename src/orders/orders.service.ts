import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCartInput, CreateCartOutput } from './dto/create-cart.dto';
import { CreateOrderInput, CreateOrderOutput } from './dto/create-order.dto';
import { DeleteCartInput, DeleteCartOutput } from './dto/delete-cart.dto';
import { MyCartInput, MyCartOutput } from './dto/my-cart.dto';
import { UpdateCartInput, UpdateCartOutput } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { Order } from './entities/order.entity';
import { CART_CONFIG_PAGES } from './order.constants';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Post)
    private readonly posts: Repository<Post>,
    @InjectRepository(Cart)
    private readonly carts: Repository<Cart>,
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
  ) {}
  async createOrder(
    customer: User,
    { cartIds, status, address }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      this.orders.create();
      const newOrder = await this.orders.save(
        this.orders.create({
          user: customer,
          address,
        }),
      );

      for (const cartId of cartIds) {
        const cart = await this.carts.findOne(cartId);

        await this.carts.save({
          id: cart.id,
          order: newOrder,
          status,
        });
      }
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '주문에 실패했습니다.',
      };
    }
  }

  async createCartItem(
    user: User,
    createCartInput: CreateCartInput,
  ): Promise<CreateCartOutput> {
    try {
      const post = await this.posts.findOne(createCartInput.postId);
      if (!post) {
        return {
          ok: false,
          error: '게시물이 존재하지 않습니다.',
        };
      }
      const cart = await this.carts.findOne({
        where: {
          user,
          post,
        },
      });
      let flag = false;
      if (cart) {
        for (const i in cart.options) {
          for (const j in cart.options[i].choices) {
            if (
              cart.options[i].choices[j].select !==
              createCartInput.options[0].choices[j].select
            ) {
              flag = true;
            }
          }
        }
        if (flag) {
          await this.carts.save([
            {
              id: cart.id,
              options: [...cart.options, ...createCartInput.options],
            },
          ]);
        } else {
          return {
            ok: true,
            already: true,
          };
        }
      } else {
        await this.carts.save(
          this.carts.create({ user, post, options: createCartInput.options }),
        );
      }
      return {
        ok: true,
        already: false,
      };
    } catch {
      return {
        ok: false,
        error: 'Cart item 추가에 실패했습니다.',
      };
    }
  }

  async myCart(user: User, { page }: MyCartInput): Promise<MyCartOutput> {
    try {
      const cartItems = await this.carts.find({
        where: {
          user,
        },
        skip: (page - 1) * CART_CONFIG_PAGES,
        take: CART_CONFIG_PAGES,
        order: {
          createdAt: 'DESC',
        },
      });
      return {
        ok: true,
        carts: cartItems,
      };
    } catch {
      return { ok: false, error: '장바구니를 검색하는데 실패했습니다.' };
    }
  }

  async updateCartItem(
    customer: User,
    { cartId, nthOption, num }: UpdateCartInput,
  ): Promise<UpdateCartOutput> {
    try {
      const cart = await this.carts.findOne(cartId);
      if (!cart) {
        return {
          ok: false,
          error: '장부구니에 물품이 존재하지 않습니다.',
        };
      }
      if (customer.id !== cart.customerId) {
        return {
          ok: false,
          error: '장바구니를 편집할 권한이 없습니다.',
        };
      }
      cart.options[nthOption].num = num;
      await this.carts.save(cart);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '장바구니를 편집하는데 실패했습니다.',
      };
    }
  }

  async deleteCartItem(
    customer: User,
    { cartId, nthOption }: DeleteCartInput,
  ): Promise<DeleteCartOutput> {
    try {
      const cart = await this.carts.findOne(cartId);
      if (!cart) {
        return {
          ok: false,
          error: '장부구니에 물품이 존재하지 않습니다.',
        };
      }
      if (customer.id !== cart.customerId) {
        return {
          ok: false,
          error: '장바구니를 편집할 권한이 없습니다.',
        };
      }

      if (typeof nthOption == 'undefined' || cart.options.length <= 1) {
        await this.carts.delete(cartId);
      } else {
        await this.carts.save([
          {
            id: cart.id,
            options: [
              ...cart.options.filter((option, index) => {
                if (index !== nthOption) {
                  return option;
                }
              }),
            ],
          },
        ]);
      }
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '장바구니를 편집하는데 실패했습니다.',
      };
    }
  }
}
