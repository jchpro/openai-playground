# OpenAI playground

## Description

Just having fun with OpenAI APIs.

## How to run

### Define API key

Create `.env` file in the repository and add:

```dotenv
# Required
OPENAI_API_KEY=<your_api_key>
# Optional, you probably only have one organization
OPENAI_ORG_ID=<your_organization_id>
```

### Directly with `ts-node`

```shell
npm start
```

This will print help with the list of commands. Once you know the command, pass the arguments to the CLI:

```shell
npm start -- chat
```
### Build and run with `node`

```shell
npm run build
node dist/index.js chat # or any other arguments
```
