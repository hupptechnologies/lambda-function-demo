## Introduction

- This project demonstrate serverless and aws lambda function.

### Features

1. Send email http endpoint using aws lambda and serverless
2. Whitelist only domains that can use this functions (Comma separated values in configurations.yml)
3. Can send image/pdf/doc/word attachments in email (base64)

### Install Serverless cli

```
npm install -g serverless
```

### Configuration

Create `configurations.yml` in root folder of project and refere `example.configurations.yml` for setting variables.

#### Project Setup
```
npm install
```

#### Start Development Server
```
npm start
```

### How to deploy

```
serverless deploy
```
