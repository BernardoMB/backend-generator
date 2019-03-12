
export interface IWriteRepository<T> {
  create(item: T): Promise<T>,
  createMany(items: T[]): Promise<T[]>,
  update(_id: string, item: T): Promise<T>,
  updateMany(conditions: any, item: T, options?: any | null): Promise<T[]>,
  delete(_id: string): Promise<T>,
  deleteMany(condition: any): Promise<any>,
  drop(): Promise<any>
}
