const sut = require('./testIndex');

// test('sut correctly works', () => {
//   for (const source of ['hello  world', 'hello   world', 'hello    world']) {
//     const actual = sut(source);
//     expect(actual).toBe('hello world');
//   }
// });

test.each`
  source              | expected
  ${'hello  world'}   | ${'hello world'}
  ${'hello   world'}  | ${'hello world'}
  ${'hello    world'} | ${'hello world'}
`('sut transforms "$source" to "$expected"', ({ source, expected }) => {
  const actual = sut(source);
  expect(actual).toBe(expected);
});
