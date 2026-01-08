import { describe, expect, it } from 'vitest';
import { SimpleDecorator } from './simple-decorator';

@SimpleDecorator
class Example {
  @SimpleDecorator
  private _myProperty01: string = '';

  @SimpleDecorator
  get property() {
    return this._myProperty01;
  }

  @SimpleDecorator
  foo(
    @SimpleDecorator
    name: string,
    @SimpleDecorator
    age: number,
  ) {
    return `Name: ${name}, Age: ${age}`;
  }
}

describe('Decorator', () => {
  it('should create an instance', () => {
    const example = new Example();

    const returnValue = example.foo('Ina', 20);

    // ====================================================
    // 출력 결과
    // ====================================================
    // ### Property Decorator ###
    // Target {}
    // Property Key foo
    // Parameter Index 1
    // ====================================================
    // ### Property Decorator ###
    // Target {}
    // Property Key foo
    // Parameter Index 0
    // ====================================================
    // ### Method Decorator ###
    // Target {}
    // Property Key foo
    // Descriptor {
    //   value: [Function: foo],
    //   writable: true,
    //   enumerable: false,
    //   configurable: true
    // }
    // ====================================================
    // ### Property Decorator ###
    // Target [class Example]
    expect(returnValue).toBe('Name: Ina, Age: 20');
  });
});
