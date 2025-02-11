import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenConfig } from '@src/config/app.config';
import { TokenService } from './token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TokenConfig>) => {
        return {
          global: true,
          secret: configService.get('authSecret'),
          signOptions: { expiresIn: configService.get('authExpireIn') },
        };
      },
    }),
  ],
  exports: [JwtModule, TokenService],
  providers: [TokenService],
})
export class TokenModule {}
