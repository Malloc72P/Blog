import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@src/config/app.config';
import { CookieOptions } from 'express';

export function createCookieOption(configService: ConfigService): CookieOptions {
  const isProduction =
    (configService as unknown as ConfigService<AppConfig>).get('nodeEnv') === 'production';

  return isProduction
    ? {
        secure: true,
        httpOnly: true,
      }
    : {
        secure: false,
        httpOnly: true,
      };
}
