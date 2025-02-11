import { Expose } from 'class-transformer';
import { ProfileResult } from '../auth';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileInput {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateProfileOutput {
  @Expose()
  profile: ProfileResult;
}
