export function generateRepeatedInjectionSegment(base: string, count: number) {
  const inject_str = ` ,1 as col1 `;
  return base.concat(inject_str.repeat(count));
}
