import 'steal-mocha';
import { assert } from 'chai';
import { render as jsRender } from '../examples/js-main/index.js';
import { render as tsRender } from '../examples/ts-main/src/index.ts';

describe('steal-typescript', () => {
    it('JavaScript main renders correctly', () => {
        var body = { innerHTML: '' };
        jsRender(body);
        assert.equal(body.innerHTML, '<h1>HELLO, WORLD!</h1>')
    });

    it('TypeScript main renders correctly', () => {
        var body = { innerHTML: '' };
        tsRender(body);
        assert.equal(body.innerHTML, '<h1>HELLO, WORLD!</h1>')
    });
});