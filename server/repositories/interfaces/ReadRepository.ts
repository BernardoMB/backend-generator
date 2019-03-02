
export interface IReadRepository<T> {
  retrieve: () => Promise<T[]>;
  retrieveBy: (conditions: any, projection?: any | null, options?: any | null) => Promise<T[]>;
  find: (conditions: any, projections?: string, options?: any) => Promise<T[]>;
  findOne: (conditions: any, projections?: string, options?: any) => Promise<T>;
  findById: (id: string) => Promise<T>;
}
