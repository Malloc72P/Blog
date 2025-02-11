import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowService } from './show.service';
import { ShowController } from './show.controller';
import { Show } from './show.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show])],
  providers: [ShowService],
  controllers: [ShowController],
  exports: [],
})
export class ShowModule {}
