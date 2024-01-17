## Deploying the project

- Install **node.js 14.XX** version (see [instructions](https://nodejs.org/en/download/package-manager/) for your OS).

- Install globally [Vue CLI](https://cli.vuejs.org/):

```bash
npm install -g @vue/cli
```

- Create project a folder and pull data from Git.

- Install **node modules**:

```bash
npm install
```

- Create **.env** environment settings file (**.env.local** for local):

```bash
cp .env.example .env.local
```

- Run the application in **development mode**:

```bash
npm run serve
```

- The project is ready to go!

## Additional commands:

- Run code **check / formatting**:

```bash
# check code style only
npm run lint

# check code style and fix all possible errors
npm run lint:fix 
```

- Run **auto tests**:

```bash
# start unit tests
npm run test:unit 

# start end to end tests
npm run test:e2e 
```

- Compile the application for the **stage / production** server:

```bash
npm run build 
```
