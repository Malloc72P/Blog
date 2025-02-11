import { Controller, Get } from '@nestjs/common';
import { HealthCheckOutput } from '@repo/dto';
import { networkInterfaces } from 'os';
import { BaseController } from './base/base.controller';
import { transformTo } from './util/transformer.util';

@Controller('api/v1/health')
export class AppController extends BaseController {
  constructor() {
    super();
  }

  @Get()
  healthCheck(): HealthCheckOutput {
    this.logger.log('health check');
    return transformTo(HealthCheckOutput, {
      statusCode: 200,
      serverAddr: this.getServerIPAddress(),
    });
  }

  getServerIPAddress() {
    const interfaces = networkInterfaces();
    for (const name in interfaces) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }

    return '127.0.0.1';
  }
}
