import 'steal-mocha';
import { assert } from 'chai';
import Greeter from './greeter.ts';

describe('steal-typescript - basics', () => {
  it('loads TypeScript module', () => {
    const greeter = new Greeter('Hello');
    assert.equal(greeter.greet(), 'Hello!');
  });
});
