export const obj = {
  keys<T extends object>(o: T) {
    return Object.keys(o) as (keyof T)[]
  },
}
