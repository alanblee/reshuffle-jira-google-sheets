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

const test = {
  id: "10043",
  self: "https://monday-sync.atlassian.net/rest/api/2/10043",
  key: "LEELEE-44",
  fields: {
    statuscategorychangedate: "2020-11-16T17:11:14.451-0800",
    issuetype: {
      self: "https://monday-sync.atlassian.net/rest/api/2/issuetype/10001",
      id: "10001",
      description: "Tasks track small, distinct pieces of work.",
      iconUrl:
        "https://monday-sync.atlassian.net/secure/viewavatar?size=medium&avatarId=10318&avatarType=issuetype",
      name: "Task",
      subtask: false,
      avatarId: 10318,
      entityId: "3145ab83-06cc-4a1e-8ea6-e3338d7a01df",
    },
    timespent: null,
    project: {
      self: "https://monday-sync.atlassian.net/rest/api/2/project/10000",
      id: "10000",
      key: "LEELEE",
      name: "monday-sync",
      projectTypeKey: "software",
      simplified: true,
      avatarUrls: [Object],
    },
    fixVersions: [],
    aggregatetimespent: null,
    resolution: null,
    resolutiondate: null,
    workratio: -1,
    issuerestriction: { issuerestrictions: {}, shouldDisplay: true },
    watches: {
      self:
        "https://monday-sync.atlassian.net/rest/api/2/issue/LEELEE-44/watchers",
      watchCount: 0,
      isWatching: true,
    },
    lastViewed: null,
    created: "2020-11-16T17:11:14.116-0800",
    customfield_10020: null,
    customfield_10021: null,
    customfield_10022: null,
    priority: {
      self: "https://monday-sync.atlassian.net/rest/api/2/priority/3",
      iconUrl:
        "https://monday-sync.atlassian.net/images/icons/priorities/medium.svg",
      name: "Medium",
      id: "3",
    },
    customfield_10023: null,
    customfield_10024: null,
    customfield_10025: null,
    labels: [],
    customfield_10016: null,
    customfield_10017: null,
    customfield_10018: {
      hasEpicLinkFieldDependency: false,
      showField: false,
      nonEditableReason: [Object],
    },
    customfield_10019: "0|i0000f:",
    timeestimate: null,
    aggregatetimeoriginalestimate: null,
    versions: [],
    issuelinks: [],
    assignee: null,
    updated: "2020-11-16T17:11:14.116-0800",
    status: {
      self: "https://monday-sync.atlassian.net/rest/api/2/status/10000",
      description: "",
      iconUrl: "https://monday-sync.atlassian.net/",
      name: "To Do",
      id: "10000",
      statusCategory: [Object],
    },
    components: [],
    timeoriginalestimate: null,
    description: "lalallala",
    customfield_10010: null,
    customfield_10014: null,
    timetracking: {},
    customfield_10015: null,
    customfield_10005: null,
    customfield_10006: null,
    security: null,
    customfield_10007: null,
    customfield_10008: null,
    attachment: [],
    customfield_10009: null,
    aggregatetimeestimate: null,
    summary: "new thing",
    creator: {
      self:
        "https://monday-sync.atlassian.net/rest/api/2/user?accountId=5fadc96cc2e5390077e7f0c6",
      accountId: "5fadc96cc2e5390077e7f0c6",
      avatarUrls: [Object],
      displayName: "Alan Lee",
      active: true,
      timeZone: "America/Los_Angeles",
      accountType: "atlassian",
    },
    subtasks: [],
    reporter: {
      self:
        "https://monday-sync.atlassian.net/rest/api/2/user?accountId=5fadc96cc2e5390077e7f0c6",
      accountId: "5fadc96cc2e5390077e7f0c6",
      avatarUrls: [Object],
      displayName: "Alan Lee",
      active: true,
      timeZone: "America/Los_Angeles",
      accountType: "atlassian",
    },
    customfield_10000: "{}",
    aggregateprogress: { progress: 0, total: 0 },
    customfield_10001: null,
    customfield_10002: null,
    customfield_10003: null,
    customfield_10004: null,
    environment: null,
    duedate: null,
    progress: { progress: 0, total: 0 },
    votes: {
      self:
        "https://monday-sync.atlassian.net/rest/api/2/issue/LEELEE-44/votes",
      votes: 0,
      hasVoted: false,
    },
  },
};
