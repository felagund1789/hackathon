// Tool Definitions
// Define the custom tools that the Copilot SDK session can use.
// Your challenge: add tool definitions here and register them with the session.

/**
 * Tool definition for fetching merged PRs since a reference point.
 * This is the primary tool -- everything starts with knowing what changed.
 */
export const getMergedPRsTool = {
  name: "get_merged_prs",
  description: "Fetch all pull requests merged since a given tag, date, or commit SHA",
  parameters: {
    type: "object" as const,
    properties: {
      owner: { type: "string" as const, description: "Repository owner (GitHub username or org)" },
      repo: { type: "string" as const, description: "Repository name" },
      since: { type: "string" as const, description: "Tag name, date (YYYY-MM-DD), or commit SHA to start from" },
    },
    required: ["owner", "repo", "since"],
  },
};

// TODO: Define getLinkedIssuesTool
// Accepts owner, repo, and prNumber parameters.
// Fetches issues linked to a specific pull request.

// TODO: Define getCommitStatsTool
// Accepts owner, repo, and prNumber parameters.
// Returns file-change statistics (files changed, additions, deletions).

// TODO: Define createDraftReleaseTool
// Accepts owner, repo, tag, name, and body parameters.
// Creates a GitHub Release in draft state.

// TODO: Define checkCIStatusTool
// Accepts owner, repo, and ref parameters.
// Returns the combined CI check status for a branch or tag.
