export class RingBuffer<T> {
  public buffer: T[] = []
  public index = 0

  constructor(buffer: T[], startIndex: number = 0) {
    this.buffer = buffer
    this.index = startIndex
  }

  public next() {
    const value = this.buffer[this.index]
    this.index += 1
    if (this.index >= this.buffer.length) this.index = 0
    return value
  }
}
