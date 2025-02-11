import { Expose } from 'class-transformer';
import { ShowDto } from './show.dto';

export class FindShowsInput {}

export class FindShowsOutput {
  @Expose()
  shows: ShowDto[];
}
