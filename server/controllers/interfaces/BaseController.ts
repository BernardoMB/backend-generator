
import { IBaseBusiness } from '../../businesses/interfaces/BaseBusiness';
import { IWriteController } from './WriteController';
import { IReadController } from './ReadController';
  
export interface IBaseController<T extends IBaseBusiness<Object>> extends IReadController, IWriteController {}
