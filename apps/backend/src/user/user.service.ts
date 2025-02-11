import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import {
  UserServiceCreateInput,
  UserServiceCreateOutput,
  UserServiceFindByEmailInput,
  UserServiceFindByEmailOrThrowInput,
  UserServiceFindByEmailOrThrowOutput,
  UserServiceFindByEmailOutput,
  UserServiceFindByIdOrThrowInput,
  UserServiceFindByIdOrThrowOutput,
  UserServiceUpdateProfileInput,
} from './user.service.dto';
import { EmailAlreadyInUse } from '@src/exceptions/already-exist-user.exception';
import { HasherService } from '@src/hasher/hasher.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private hasherService: HasherService
  ) {}

  async findByEmailOrThrow({
    email,
  }: UserServiceFindByEmailOrThrowInput): Promise<UserServiceFindByEmailOrThrowOutput> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('이미 삭제되었거나 존재하지 않는 사용자입니다.');
    }

    return { user };
  }

  async findByEmail({ email }: UserServiceFindByEmailInput): Promise<UserServiceFindByEmailOutput> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    return { user };
  }

  async findByIdOrThrow({
    id,
  }: UserServiceFindByIdOrThrowInput): Promise<UserServiceFindByIdOrThrowOutput> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('이미 삭제되었거나 존재하지 않는 사용자입니다.');
    }

    return { user };
  }

  async create({
    email,
    name,
    password,
  }: UserServiceCreateInput): Promise<UserServiceCreateOutput> {
    const { user } = await this.findByEmail({ email });

    if (user) {
      throw new EmailAlreadyInUse();
    }

    const savedUser = await this.userRepository.save({
      email: email,
      name: name,
      password: await this.hasherService.hashPassword(password),
    });

    return { user: savedUser };
  }

  async updateProfile({
    id,
    name,
  }: UserServiceUpdateProfileInput): Promise<UserServiceCreateOutput> {
    const { user } = await this.findByIdOrThrow({ id });

    user.updateProfile({ name });

    await this.userRepository.save(user);

    return { user };
  }
}
