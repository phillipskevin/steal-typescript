import Greeter from './greeter';

export function render(body : any) {
    const greeter = new Greeter("Hello, world");
    body.innerHTML = `<h1>${greeter.greet()}</h1>`;
}