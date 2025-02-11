export function cn(...classes: (string | undefined)[]) {
  return classes.filter((v) => !!v).join(' ');
}
