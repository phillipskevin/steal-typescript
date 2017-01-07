import exclaim from './exclaim';
import toUpper from 'lodash/toUpper';

export default class Greeter {
    constructor(public greeting: string) { }

    greet() {
        return toUpper(exclaim(this.greeting));
    }
};
