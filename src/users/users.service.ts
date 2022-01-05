import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Cart } from 'src/orders/entities/cart.entity';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,

    @InjectRepository(Cart)
    private readonly carts: Repository<Cart>,

    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    nickname,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const existEmail = await this.users.findOne({ email });
      const existNick = await this.users.findOne({ nickname });
      if (existEmail) {
        return { ok: false, error: '이미 다른 유저가 사용하는 메일입니다.' };
      }
      if (existNick) {
        return { ok: false, error: '이미 다른 유저가 사용하는 닉네임입니다.' };
      }
      await this.users.save(
        this.users.create({ email, password, nickname, role }),
      );
      return { ok: true };
    } catch (e) {
      return { ok: false, error: '계정을 만들 수 없습니다.' };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      if (!user) {
        return {
          ok: false,
          error: '일치하는 사용자가 없습니다.',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: '틀린 비밀번호입니다.',
        };
      }

      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: '로그인에 실패했습니다.',
      };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({ id });
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return { ok: false, error: 'User Not Found' };
    }
  }

  async editProfile(
    userId: number,
    { nickname, password, address }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne(userId);
      user.nickname = nickname;
      user.password = password;
      user.address = address;
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: '프로필 수정에 실패했습니다.' };
    }
  }

  async getCartsNumber(user: User) {
    try {
      const [_, totalCarts] = await this.carts.findAndCount({
        where: {
          user,
          status: 'OnCart',
        },
      });
      return totalCarts;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
