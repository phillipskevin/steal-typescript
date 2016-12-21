# steal-typescript

[![Build Status](https://travis-ci.org/phillipskevin/steal-typescript.svg?branch=master)](https://travis-ci.org/phillipskevin/steal-typescript)
[![npm version](https://badge.fury.io/js/steal-typescript.svg)](https://badge.fury.io/js/steal-typescript)

Use [StealJS](https://stealjs.com/) to load TypeScript modules — no build required. Here are the steps to get started:

## Install `steal` and `steal-typescript`.

```
npm install --save steal steal-typescript
```

## Update your `package.json` to add `steal-typescript` as a `steal` plugin

```json
  "steal": {
    "plugins": [
      "steal-typescript"
    ]
  }
```

## Create your `index.html` file:

```html
<!doctype html>
<html>
  <body>
    <script src="./node_modules/steal/steal.js" main="index.ts"></script>
  </body>
</html>
```

## Create your `index.ts` file:

```ts
class Greeter {
    constructor(public greeting: string) { }
    greet() {
        return "<h1>" + this.greeting + "</h1>";
    }
};

var greeter = new Greeter("Hello, world!");
    
document.body.innerHTML = greeter.greet();
```

## Load your app in a browser

That's it. Your app is ready to go.
