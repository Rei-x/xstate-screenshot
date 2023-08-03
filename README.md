# xstate screenshot

CLI usage:

```
npx xstate-screenshot gen <files glob just like in xstate typegen>
```

It will generate screenshots next to your machines
```
- src
  - machine1.ts
  - machine1.png
  - machine2.ts
  - machine2.png
```

Programmatic usage:

```ts
import { generateScreenshots } from "xstate-screenshot";

const main = async () => {
  const result = await generateScreenshots("src"); // or wherever you have your machines

  result.forEach(async (ss) => {
    console.log(`${ss.filename}: ${ss.screenshotUrl}`);
  });
}

void main();
```
