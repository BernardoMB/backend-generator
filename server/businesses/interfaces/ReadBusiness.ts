
export interface IReadBusiness<T> {
  retrieve: () => Promise<T[]>;
  findById: (id: string) => Promise<T>;
}
