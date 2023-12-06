export const NumberUtils = {
  solveQuadraticEquation(a: number, b: number, c: number) {
    const root = Math.sqrt(b ** 2 - 4 * a * c)
    const x1 = (-b + root) / (2 * a)
    const x2 = (-b - root) / (2 * a)
    return { x1, x2 }
  },
}
