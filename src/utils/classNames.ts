export function classNames(
  ...args: (string | false | null | undefined)[]
): string {
  return args.filter(Boolean).join(' ');
}
