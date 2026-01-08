export interface LoggerOptions {
  mode: 'simple' | 'detailed';
}

/**
 * 데코레이터는 클래스가 정의되는 시점에 딱 한 번 실행되어 세팅을 마친다.
 * 아래의 데코레이터는 descriptor.value에 들어있는 원본 함수를 새 함수로 교체한다.
 * 새 함수는 원본 함수를 호출하기 전과 후에 로그를 출력한다.
 *
 * 원본 코드를 수정하지 않고도 함수의 동작을 확장할 수 있다.
 * - 핵심 비즈니스 로직과 분리된 횡단 관심사(cross-cutting concern)를 처리할 때 유용하다.
 * - 로깅, 성능 측정, 권한 검사 등에 활용할 수 있다.
 */
export function Logger({ mode }: LoggerOptions = { mode: 'simple' }) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      console.log(`${propertyKey}를 호출합니다.`);
      if (mode === 'detailed') {
        console.log('매개변수:', args);
      }

      const result = originalMethod.apply(this, args);

      console.log(`${propertyKey} 호출이 완료되었습니다`);
      if (mode === 'detailed') {
        console.log('반환값:', result);
      }

      return result;
    };

    return descriptor;
  };
}
