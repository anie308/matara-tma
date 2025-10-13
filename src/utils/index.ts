export function addSpacesToNumber(number: number) {
  const numString = number?.toString();
  const parts = [];
  let i = numString?.length;

  while (i > 0) {
    parts.unshift(numString.substring(Math.max(0, i - 3), i));
    i -= 3;
  }

  return parts.join(" ");
}