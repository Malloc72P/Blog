import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AppDataSource } from './database/database.provider';
import { HasherModule } from './hasher/hasher.module';
import { ShowModule } from './show/show.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { LoggingExceptionFilter } from './config/global-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    ShowModule,
    UserModule,
    AuthModule,
    HasherModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: LoggingExceptionFilter,
    },
  ],
})
export class AppModule {}
