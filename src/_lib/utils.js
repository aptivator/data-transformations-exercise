export function identity(value) {
  return value;
}

export function isObject(o) {
  return o?.constructor === Object;
}

export function sum(numbers) {
  return numbers.reduce((sum, number) => sum + number);
}
