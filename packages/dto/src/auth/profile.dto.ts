import { Expose } from 'class-transformer';

export class ProfileResult {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;
}
