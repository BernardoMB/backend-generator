import { init, close } from '../main';

beforeAll(async (done) => {
    await init();
    done();
});

afterAll(async (done) => {
    await close();
    done();
});
