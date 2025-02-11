import { Expose } from 'class-transformer';

export class HealthCheckOutput {
  @Expose()
  statusCode: number;

  @Expose()
  serverAddr: string;
}
