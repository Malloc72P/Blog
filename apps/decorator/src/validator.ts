import 'reflect-metadata';

export interface MinLength {
  length: number;
  message?: string;
}

/**
 * 메타 정보를 저장하는 경우 Reflect API를 활용할 수 있다.
 * reflect-metadata 패키지를 설치하고 import 해야 한다.
 */
export function MinLength({ length, message = '최소 길이는 ${length}입니다.' }: MinLength) {
  return function (target: any, propertyKey: string) {
    // 유효성 검사에 사용할 메타데이터 정의
    const constraint = { value: length, message };

    // Reflect API를 사용해 메타데이터 저장
    Reflect.defineMetadata('minLength', constraint, target, propertyKey);
  };
}

export function validate(target: any) {
  // 대상 객체의 각 속성에 대해 메타데이터 확인 및 유효성 검사 수행
  for (const propertyKey of Object.keys(target)) {
    // Reflect API를 사용해 유효성 검사를 위한 메타데이터 조회
    const constraint = Reflect.getMetadata('minLength', target, propertyKey);

    // 유효성 검사 메타데이터가 존재한다면,
    if (constraint) {
      const value = target[propertyKey];

      // 유효성 검사 수행
      if (typeof value === 'string' && value.length < constraint.value) {
        const errorMessage = constraint.message.replace('${length}', constraint.value.toString());

        console.log(errorMessage);
        throw new Error(errorMessage);
      }
    }
  }

  console.log('유효성 검사를 통과했습니다.');
}
