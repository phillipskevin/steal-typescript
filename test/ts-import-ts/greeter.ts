import exclaim from './exclaim';

export default class Greeter {
    constructor(public greeting: string) { }

    greet() {
        return exclaim(this.greeting);
    }
};
