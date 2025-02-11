import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { BaseConstants } from './base/base.constant';
import { AppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService) as ConfigService<AppConfig>;

  configCORS(app, configService);
  configCookie(app);

  await app.listen(configService.get('appPort') ?? BaseConstants.app.defaultPort);
}

bootstrap();

/**
 * CORS 설정
 */
function configCORS(app: INestApplication<any>, configService: ConfigService<AppConfig>) {
  app.enableCors({
    credentials: true,
    origin: configService.get('clientUrl'),
  });
}

/**
 * 쿠키 설정
 */
function configCookie(app: INestApplication<any>) {
  app.use(cookieParser());
}
