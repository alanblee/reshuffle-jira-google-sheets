require("dotenv").config();
const { Reshuffle } = require("reshuffle");
const { JiraConnector } = require("reshuffle-jira-connector");
const { GoogleSheetsConnector } = require("reshuffle-google-connectors");

(async () => {
  const app = new Reshuffle();

  const jira = new JiraConnector(app, {
    host: process.env.JIRA_HOST,
    protocol: process.env.JIRA_PROTOCOL,
    username: process.env.JIRA_USERNAME,
    password: process.env.JIRA_PASSWORD,
    baseURL: process.env.RUNTIME_BASE_URL,
  });

  const googleSheets = new GoogleSheetsConnector(app, {
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    sheetsId: process.env.GOOGLE_SHEET_ID,
  });

  // const docInfo = await googleSheets.getInfo();
  // console.log(`Document has ${docInfo.sheetCount} sheets.`);

  jira.on({ jiraEvent: "jira:issue_created" }, async (event, app) => {
    const {
      id,
      fields: {
        summary,
        description,
        status: { name },
        assignee: { displayName },
      },
    } = event.issue;

    const sheetId = 0;
    const values = [id, description, summary, name, displayName];
    const test = await googleSheets.addRow(sheetId, values);
  });

  app.start(8000);
})().catch(console.error);
