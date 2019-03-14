import { sum } from './foo';

test('basic', () => {
    expect(sum()).toBe(0);
});

test('basic again', () => {
    expect(sum(1, 2)).toBe(3);
});

/**
 * Why testing?
 *
 * Saves time
 * Creates reliable software
 * Gives flexibility to developers
 * Refractoring
 * Collaborating
 * Profiling
 * Peace of mind
 */

// Some other tests

const mockCallback = jest.fn(x => 42 + x);
[0, 1].forEach(mockCallback);

test('Mock functions', () => {
    // The mock function is called twice
    expect(mockCallback.mock.calls.length).toBe(2);

    // The first argument of the first call to the function was 0
    expect(mockCallback.mock.calls[0][0]).toBe(0);

    // The first argument of the second call to the function was 1
    expect(mockCallback.mock.calls[1][0]).toBe(1);

    // The return value of the first call to the function was 42
    expect(mockCallback.mock.results[0].value).toBe(42);
});