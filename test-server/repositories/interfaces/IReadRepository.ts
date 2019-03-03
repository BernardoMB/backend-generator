export interface IReadRepository<T> {
    read(): Promise<T[]>,
    retrieveBy(conditions: any, projection?: any | null, options?: any | null): Promise<T[]>,
    findById(_id: string): Promise<T>,
    find(conditions: any, projections?: string, options?: any): Promise<T[]>,
    findOne(conditions: any, projections?: string, options?: any): Promise<T>
}
