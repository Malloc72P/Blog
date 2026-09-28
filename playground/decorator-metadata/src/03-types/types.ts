import 'reflect-metadata';

function Mark(target: object, propertyKey: string) {}

interface Point {
  x: number;
  y: number;
}

class Color {
  constructor(public hex: string) {}
}

class Box<T> {
  constructor(public value: T) {}
}

enum Align {
  Left,
  Right,
}

type Size = 'small' | 'large';

class Sample<T> {
  @Mark str: string = '';
  @Mark num: number = 0;
  @Mark bool: boolean = false;
  @Mark date: Date = new Date();
  @Mark list: string[] = [];
  @Mark tuple: [number, number] = [0, 0];
  @Mark optional?: string;
  @Mark nullable: string | null = null;
  @Mark maybe: string | undefined = undefined;
  @Mark union: string | number = '';
  @Mark literal: Size = 'small';
  @Mark align: Align = Align.Left;
  @Mark point: Point = { x: 0, y: 0 };
  @Mark color: Color = new Color('#000');
  @Mark box: Box<string> = new Box('');
  @Mark map: Map<string, number> = new Map();
  @Mark record: Record<string, number> = {};
  @Mark callback: () => void = () => {};
  @Mark generic: T;
  @Mark anything: unknown = null;
  @Mark inferred = 1;

  constructor(generic: T) {
    this.generic = generic;
  }
}

const proto = Sample.prototype;
for (const key of Object.keys(new Sample(1))) {
  const type: unknown = Reflect.getMetadata('design:type', proto, key);
  const name = typeof type === 'function' ? type.name : String(type);
  console.log(key.padEnd(10), name);
}
