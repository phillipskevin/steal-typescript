import exclaim from './exclaim';
import * as _ from 'lodash';

export default class Greeter {
    constructor(public greeting: string) { }

    greet() {
        return _.toUpper(exclaim(this.greeting));
    }
};
