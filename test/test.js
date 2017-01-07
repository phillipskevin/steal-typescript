import 'steal-mocha';
import { assert } from 'chai';
import exclaim from '../examples/greeter/exclaim.ts';
import Greeter from '../examples/greeter/greeter.ts';

describe('steal-typescript', () => {
    it('can load a typescript module', () => {
        assert.equal(exclaim('Hello'), 'Hello!');
    });

    it('can load a typescript module that loads another typescript module', () => {
        const greeter = new Greeter('Hello');
        assert.equal(greeter.greet(), 'HELLO!');
    });
});