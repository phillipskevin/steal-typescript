import Greeter from './greeter.ts';
var greeter = new Greeter("Hello, world");
document.body.innerHTML = `<h1>${greeter.greet()}</h1>`;