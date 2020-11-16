require("dotenv").config();
const { Reshuffle } = require("reshuffle");
const { JiraConnector } = require("reshuffle-jira-connector");
const { MondayConnector } = require("reshuffle-monday-connector");
(async () => {
  const app = new Reshuffle();

  const jira = new JiraConnector(app, {
    host: process.env.JIRA_HOST,
    protocol: process.env.JIRA_PROTOCOL,
    username: process.env.JIRA_USERNAME,
    password: process.env.JIRA_PASSWORD,
    baseURL: process.env.RUNTIME_BASE_URL,
  });
  const monday = new MondayConnector(app, {
    token: process.env.MONDAY_TOKEN,
    baseURL: process.env.RUNTIME_BASE_URL,
  });
  const mondayBoard = Number(process.env.MONDAY_BOARD_ID);

  jira.on({ jiraEvent: "jira:issue_created" }, (event, app) => {
    console.log(event.webhookEvent);
    console.log(event.issue);
  });

  app.start(8000);
})().catch(console.error);
