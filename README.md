# Slack ChatGPT
ChatGPT on Slack!

## Usage

1. Create a Slack App and install it to your workspace. You can use `manifest.yml` to create the app.
2. Get an API key from [here](https://platform.openai.com/account/api-keys).
3. Set environment variables in the `.env` file.
```
  SLACK_SIGNING_SECRET=
  SLACK_BOT_TOKEN=
  SLACK_APP_TOKEN=
  CHATGPT_API_KEY=
```
4. Run the app.
```
  $ yarn start
```
