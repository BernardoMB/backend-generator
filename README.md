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