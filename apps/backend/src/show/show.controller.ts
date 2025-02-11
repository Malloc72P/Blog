import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { FindShowsInput, FindShowsOutput, ShowDto } from '@repo/dto';
import { BaseController } from '@src/base/base.controller';
import { transformTo } from '@src/util/transformer.util';
import { ShowService } from './show.service';
import { JwtAuthGuard } from '@src/auth/auth.guard';

@Controller('api/v1/shows')
export class ShowController extends BaseController {
  constructor(private showService: ShowService) {
    super();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async shows(@Body() param: FindShowsInput): Promise<FindShowsOutput> {
    const { shows } = await this.showService.findAll();

    return {
      shows: shows.map((show) => transformTo(ShowDto, show)),
    };
  }
}
