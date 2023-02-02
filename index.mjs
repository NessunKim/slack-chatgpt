import "dotenv/config";
import { ChatGPTAPI } from "chatgpt";
import bolt from "@slack/bolt";
import { appendFile, readFile, writeFile } from "fs/promises";

const app = new bolt.App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  extendedErrorHandler: true,
});

const api = new ChatGPTAPI({
  apiKey: process.env.CHATGPT_API_KEY,
});

async function startNewSession(channel, tsOrThreadTs, receivedText) {
  const res = await api.sendMessage(receivedText);
  await appendFile(
    "sessions.txt",
    `${channel} ${tsOrThreadTs} ${res.conversationId} ${res.id}\n`
  );
  console.log(`Created session: ${channel} ${tsOrThreadTs} ${res.conversationId} ${res.id}`);
  console.log(`Message received: ${receivedText}, response: ${res.text}`)
  await app.client.chat.postMessage({
    channel: channel,
    thread_ts: tsOrThreadTs,
    text: res.text,
  });
}

async function findExistingSession(channel, threadTs) {
  const sessions = await readFile("sessions.txt", "utf-8");
  const session = sessions.split("\n").find((session) => {
    const [channelHere, threadTsHere] = session.split(" ");
    return channel === channelHere && threadTs === threadTsHere;
  });
  if (!session) return null
  console.log(`Found session: ${session}`);
  return session;
}

async function followUp(channel, threadTs, conversationId, parentMessageId, receivedText) {
  const res = await api.sendMessage(receivedText, {
    conversationId,
    parentMessageId,
  });
  const sessions = await readFile("sessions.txt", "utf-8");
  await writeFile(
    "sessions.txt",
    sessions.replace(
      `${channel} ${threadTs} ${res.conversationId} ${parentMessageId}\n`,
      `${channel} ${threadTs} ${res.conversationId} ${res.id}\n`
    )
  );
  console.log(`Updated session: ${channel} ${threadTs} ${res.conversationId} ${res.id}`);
  console.log(`Message received: ${receivedText}, response: ${res.text}`);
  await app.client.chat.postMessage({
    channel,
    thread_ts: threadTs,
    text: res.text,
  });
}

app.event("app_mention", async ({ event }) => {
  const threadTs = event.thread_ts;
  if (threadTs) { // If the message is in a thread
    const session = await findExistingSession(event.channel, threadTs);
    if (session) {
      return;
    }
  }
  await startNewSession(event.channel, threadTs || event.ts, event.text);
});

app.event("message", async ({ event }) => {
  const threadTs = event.thread_ts;
  if (!threadTs) return;
  const session = await findExistingSession(event.channel, threadTs);
  if (!session) return;
  const [channel, ts, conversationId, id] = session.split(" ");
  await followUp(channel, ts, conversationId, id, event.text);
});

await app.start();
console.log("Slack ChatGPT bot is running!");
