
import { IReadBusiness } from './ReadBusiness';
import { IWriteBusiness } from './WriteBusiness';

export interface IBaseBusiness<T> extends IReadBusiness<T>, IWriteBusiness<T> {
  throwIfNotExists?: (item: T) => void;
}
