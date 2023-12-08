export const NumberUtils = {
  solveQuadraticEquation(a: number, b: number, c: number) {
    const root = Math.sqrt(b ** 2 - 4 * a * c)
    const x1 = (-b + root) / (2 * a)
    const x2 = (-b - root) / (2 * a)
    return { x1, x2 }
  },
  // Use the greatest common divisor (GCD) formula and the fact that lcm(x, y) = x * y / gcd(x, y) to determine the least common multiple
  // https://www.30secondsofcode.org/js/s/lcm/
  leastCommonMultiple(...arr: number[]) {
    const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y))
    const _lcm = (x: number, y: number) => (x * y) / gcd(x, y)
    return [...arr].reduce((a, b) => _lcm(a, b))
  },
}
