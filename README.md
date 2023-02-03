# Slack ChatGPT
ChatGPT on Slack!

## Installation

1. Create a Slack App and install it to your workspace. You can use `manifest.yml` to create the app.
2. Get an API key from [here](https://platform.openai.com/account/api-keys).
3. Set environment variables in the `.env` file.
```
  SLACK_SIGNING_SECRET=
  SLACK_BOT_TOKEN=
  SLACK_APP_TOKEN=
  OPENAI_API_KEY=
```
4. Run the app.
```sh
  $ yarn start
  # or run in daemon mode
  $ yarn daemon
```
5. To stop the daemon, run
```sh
  $ yarn stop
```

Or you can use docker-compose to run the app.
1. Set environment variables in the `.env` file.
```
  SLACK_SIGNING_SECRET=
  SLACK_BOT_TOKEN=
  SLACK_APP_TOKEN=
  OPENAI_API_KEY=
```
2. Run the app with docker-compose.
```sh
  $ docker-compose up -d
```

## Usage

Mention the bot to start a conversation.
```
  @ChatGPT How are you?
```

The bot will add a response to the thread.
```
  I'm doing well, thank you.
```

Then you can continue the conversation.
```
  What's your favorite color?
```
