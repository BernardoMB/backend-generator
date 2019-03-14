# Back-end Generator

### Milestones

- Configure propper environment variables
- Improve authentication methods
- Use winston logger only
- Better error handling

## Instructions

Modify `models.json` for configuring the server.

Generate server files:
```bash
$ npm run generate
```

Delete the generated files:
```bash
$ npm run clean
```

Delete the generated files and create them again:
```bash
$ npm run regenerate
```

Run the generated express application:
```
$ npm run generated-server
```
or
```bash
$ npm run generated-server-watch
```

Test all endpoints
```bash
$ npm test
```

# Testing

The generated code is tested using the popular npm library Jest.

Test the application using Jest:
```bash
$ npm run test
```

See the folowing link to use Jest inside a typescript project: <https://github.com/basarat/typescript-book/blob/master/docs/testing/jest.md>