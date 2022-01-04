import { Module } from '@nestjs/common';
import { OrderResolver } from './orders.resolver';
import { OrderService } from './orders.service';

@Module({
  providers: [OrderResolver, OrderService],
})
export class OrdersModule {}
