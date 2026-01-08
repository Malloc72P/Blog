import { describe, it, expect } from 'vitest';
import { Logger } from './logger';

class Example {
  @Logger()
  foo(name: string, age: number) {
    return `Name: ${name}, Age: ${age}`;
  }
}

class Example2 {
  @Logger({ mode: 'detailed' })
  foo(name: string, age: number) {
    return `Name: ${name}, Age: ${age}`;
  }
}

describe('Decorator', () => {
  it('Logger simple mode', () => {
    const example = new Example();
    const returnValue = example.foo('Ina', 20);
    expect(returnValue).toBe('Name: Ina, Age: 20');
  });

  it('Logger detailed mode', () => {
    const example2 = new Example2();
    const returnValue = example2.foo('Ina', 20);
    expect(returnValue).toBe('Name: Ina, Age: 20');
  });
});
