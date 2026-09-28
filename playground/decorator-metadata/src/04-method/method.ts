import 'reflect-metadata';

class Logger {}

// NestJS의 @Injectable()과 달리 팩토리가 아니라 데코레이터 함수 자체라 괄호 없이 붙인다
function Injectable(target: Function) {}
function Mark(target: object, propertyKey: string, descriptor: PropertyDescriptor) {}

@Injectable
class TitleService {
  constructor(private logger: Logger, private prefix: string) {}

  @Mark
  format(text: string, size: number): string {
    return `${this.prefix}${text}:${size}`;
  }

  // 반환 타입을 적지 않은 메서드
  @Mark
  count(text: string) {
    return text.length;
  }
}

// 데코레이터가 없는 클래스
class PlainService {
  constructor(private logger: Logger) {}
}

const proto = TitleService.prototype;
console.log('design:type      ', Reflect.getMetadata('design:type', proto, 'format'));
console.log('design:paramtypes', Reflect.getMetadata('design:paramtypes', proto, 'format'));
console.log('design:returntype', Reflect.getMetadata('design:returntype', proto, 'format'));
console.log('생성자 paramtypes', Reflect.getMetadata('design:paramtypes', TitleService));
console.log('count의 returntype', Reflect.getMetadata('design:returntype', proto, 'count'));
console.log('PlainService 생성자 paramtypes', Reflect.getMetadata('design:paramtypes', PlainService));
