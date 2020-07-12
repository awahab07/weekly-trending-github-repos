export class Persistence {
  private storage: Storage;

  constructor(win?: Window) {
    const w = win ?? window;
    this.storage = w.localStorage;
  }

  set(key: string, item: any): void {
    this.storage.setItem(key, JSON.stringify(item));
  }

  get<T>(key: string): T | null {
    const item = this.storage.getItem(key);

    return item === null ? null : (JSON.parse(item) as T);
  }
}
