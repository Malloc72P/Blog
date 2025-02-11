import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { HasherModule } from '@src/hasher/hasher.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HasherModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
