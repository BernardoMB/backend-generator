export interface IWriteBusiness<T> {
    read(): Promise<Array<T>>,
    findById(_id: string): Promise<T>
}