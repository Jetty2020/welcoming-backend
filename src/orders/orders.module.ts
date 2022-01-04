import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Cart } from './entities/cart.entity';
import { Order } from './entities/order.entity';
import { CartResolver, OrderResolver } from './orders.resolver';
import { OrderService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Post, Order])],
  providers: [OrderResolver, OrderService, CartResolver],
})
export class OrdersModule {}
