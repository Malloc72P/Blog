import { ClassConstructor, plainToInstance } from 'class-transformer';

export function transformTo<T, V>(cls: ClassConstructor<T>, originObj: V): T {
  return plainToInstance(cls, originObj, { excludeExtraneousValues: true });
}
