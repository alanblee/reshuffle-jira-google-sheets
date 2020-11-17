require("dotenv").config();
const { Reshuffle } = require("reshuffle");
const { JiraConnector } = require("reshuffle-jira-connector");
const { GoogleSheetsConnector } = require("reshuffle-google-connectors");

(async () => {
  const app = new Reshuffle();
  // Jira Config
  const jira = new JiraConnector(app, {
    host: process.env.JIRA_HOST,
    protocol: process.env.JIRA_PROTOCOL,
    username: process.env.JIRA_USERNAME,
    password: process.env.JIRA_PASSWORD,
    baseURL: process.env.RUNTIME_BASE_URL,
  });
  // Google Sheets Config
  const googleSheets = new GoogleSheetsConnector(app, {
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    sheetsId: process.env.GOOGLE_SHEET_ID,
  });

  jira.on({ jiraEvent: "jira:issue_created" }, async (event, app) => {
    const {
      id,
      fields: { summary, description },
    } = event.issue;
    const sheetId = 0;
    const values = [
      id,
      summary,
      description,
      event.issue.fields.status.name,
      event.issue.fields.assignee
        ? event.issue.fields.assignee.displayName
        : "unassigned",
    ];
    await googleSheets.addRow(sheetId, values);
  });

  googleSheets.on({}, async (event, app) => {
    if (
      event.worksheetsChanged[0] &&
      event.worksheetsChanged[0].rowsChanged[0]
    ) {
      const { curr, prev } = event.worksheetsChanged[0].rowsChanged[0];

      // Need to find the transition ids to move the issues around
      const { transitions } = await jira
        .sdk()
        .listTransitions(curr["Issue ID"]);
      let transitionId = {};
      for (let status of transitions) {
        if (!transitionId[status.name]) {
          transitionId[status.name] = status.id;
        }
      }

      let updates = { fields: {} };
      for (let key in prev) {
        if (prev[key] !== curr[key]) {
          if (curr[key] in transitionId) {
            transitionId = { id: transitionId[curr[key]] };
            await jira.sdk().transitionIssue(curr["Issue ID"], {
              transition: {
                id: transitionId.id,
              },
            });
          } else {
            updates = {
              fields: { ...updates.fields, [[key.toLowerCase()]]: curr[key] },
            };
          }
        }
      }
      // jira update
      const updateIssue = await jira
        .sdk()
        .updateIssue(curr["Issue ID"], updates);
    }
  });

  app.start(8000);
})().catch(console.error);
