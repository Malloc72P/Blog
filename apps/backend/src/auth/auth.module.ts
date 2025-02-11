////////////////////////////////////////////////////////////////////////////////
// auth.module.ts
// 2024. 10. 15. created by Malloc72P
// -----------------------------------------------------------------------------
// Copyright (c) 2024 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Module } from '@nestjs/common';
import { HasherModule } from 'src/hasher/hasher.module';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtPassportStrategy } from './passport-strategies/jwt-passport.strategy';
import { LocalPassportStrategy } from './passport-strategies/local-passport.strategy';
import { RefreshPassportStrategy } from './passport-strategies/refresh-passport.strategy';

@Module({
  imports: [UserModule, HasherModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, LocalPassportStrategy, JwtPassportStrategy, RefreshPassportStrategy],
  exports: [AuthService],
})
export class AuthModule {}
