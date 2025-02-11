import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseComponent } from '@src/base/base.component';
import { Repository } from 'typeorm';
import { Show } from './show.entity';
import {
  ShowServiceFindAllOutput,
  ShowServiceFindOneInput,
  ShowServiceFindOneOutput,
  ShowServiceRemoveInput,
  ShowServiceRemoveOutput,
} from './show.service.dto';

@Injectable()
export class ShowService extends BaseComponent {
  constructor(@InjectRepository(Show) private showRepository: Repository<Show>) {
    super();
  }

  async findAll(): Promise<ShowServiceFindAllOutput> {
    const shows = await this.showRepository.find();

    return {
      shows,
    };
  }

  async findOne({ id }: ShowServiceFindOneInput): Promise<ShowServiceFindOneOutput> {
    const show = await this.showRepository.findOneBy({ id });

    if (!show) {
      throw new NotFoundException('이미 삭제되었거나 존재하지 않는 쇼 입니다.');
    }

    return {
      show,
    };
  }

  async remove({ id }: ShowServiceRemoveInput): Promise<ShowServiceRemoveOutput> {
    const { show } = await this.findOne({ id });

    show.delete();

    await this.showRepository.save(show);
  }
}
