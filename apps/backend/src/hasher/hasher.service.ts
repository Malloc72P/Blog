import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HasherService {
  constructor() {}

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async verifyPassword(hashedPassword: string, inputPassword: string): Promise<boolean> {
    return await argon2.verify(hashedPassword, inputPassword);
  }
}
