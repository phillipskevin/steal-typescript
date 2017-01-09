import Greeter from './greeter.ts';

export function render(body) {
    const greeter = new Greeter("Hello, world");
    body.innerHTML = `<h1>${greeter.greet()}</h1>`;
}