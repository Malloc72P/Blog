export function prepareParam<T>(param: object, defaultOption: object) {
  for (const key in defaultOption) {
    if (!Reflect.get(param, key)) {
      Reflect.set(param, key, Reflect.get(defaultOption, key));
    }
  }

  return param as T;
}
