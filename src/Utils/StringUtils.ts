export const StringUtils = {
  isNumberString(value: string) {
    return !!value.match(/^\d+$/)
  },
}
