import { CatRepository } from '../../repositories/CatRepository';
import { UserRepository } from '../../repositories/UserRepository';
import { IUser } from '../../models/interfaces/IUser';

describe('Cat routes', () => {
    const catRepository = new CatRepository();
    const userRepository = new UserRepository();
    beforeAll(async () => {
        await userRepository.drop();
        await catRepository.drop();
        const user: IUser = <IUser>{
            email: "john.doe@example.com",
            password: "asd123"
        }
        await userRepository.create(user);
    });

});