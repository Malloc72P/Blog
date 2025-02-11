import { Expose } from 'class-transformer';

export class ShowDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  tags: string[];
}
