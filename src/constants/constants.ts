export const PokerCardValues = new Map<string, number>([
  ...Array(8)
    .fill(0)
    .map<[string, number]>((_, v) => [(v + 2).toString(), v + 2]),
  ['T', 10],
  ['J', 11],
  ['Q', 12],
  ['K', 13],
  ['A', 14],
])
