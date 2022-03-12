import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { TOKEN_KEY } from './common/common.constants';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/entities/post.entity';
import { Scrap } from './posts/entities/scrap.entity';
import { OrdersModule } from './orders/orders.module';
import { Cart } from './orders/entities/cart.entity';
import { Order } from './orders/entities/order.entity';
import { UploadsModule } from './upload/uploads.module';
import { Comment } from './posts/entities/comment.entity';
import { Nested } from './posts/entities/nested.entity';
import { Event } from './posts/entities/event.entity';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production').required(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
        PRIVATE_KEY: Joi.string().required(),
        AWS_KEY: Joi.string().required(),
        AWS_SECRET: Joi.string().required(),
        GMAIL_ID: Joi.string().required(),
        GMAIL_PW: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          }),
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      entities: [User, Post, Scrap, Cart, Order, Comment, Nested, Event],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => ({ token: req.headers[TOKEN_KEY] }),
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      gmailId: process.env.GMAIL_ID,
      gmailPW: process.env.GMAIL_PW,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    OrdersModule,
    UploadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
