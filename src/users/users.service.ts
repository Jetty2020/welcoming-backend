import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
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

      const token = 'Token';
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
}
