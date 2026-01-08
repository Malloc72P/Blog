export function SimpleDecorator(
  target: any,
  propertyKey?: string,
  descriptor?: PropertyDescriptor | number,
) {
  console.log('====================================================');
  console.log('Target', target);
  console.log('Property Key', propertyKey);
  console.log('Descriptor', descriptor);
}
