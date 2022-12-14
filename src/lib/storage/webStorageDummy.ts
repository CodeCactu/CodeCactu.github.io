const webStorageDummy = new class WebStorageDummy implements Storage {
  [name:string]: any
  length: number = 0

  clear(): void {}
  getItem(): string | null {
    return null
  }
  key(): string | null {
    return null
  }
  removeItem(): void {}
  setItem(): void {}

}
export default webStorageDummy
