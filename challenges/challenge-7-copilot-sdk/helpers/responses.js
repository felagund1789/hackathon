// GitHub Tools (JS version)
// Utility functions for fetching release-related data from the GitHub API.
// Your challenge: implement these tools and register them with the Copilot SDK session.

import { Octokit } from "@octokit/rest";

/**
 * Create an authenticated Octokit client.
 * Uses GITHUB_TOKEN from the environment.
 */
export function createOctokit() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  return new Octokit({ auth: token });
}

// TODO: Implement getMergedPRs(owner, repo, since)
// Fetch all pull requests merged since a given tag, date, or commit SHA.
// Return a simplified array: [{ number, title, body, labels, author, mergedAt, url }]
//
// Hint: Use octokit.rest.pulls.list({ owner, repo, state: "closed", sort: "updated" })
// then filter by merged_at date. For tag-based lookups, first resolve the tag to a date.

// TODO: Implement getLinkedIssues(owner, repo, prNumber)
// For a given PR, fetch the issues referenced in its body or linked via the timeline API.
// Return a simplified array: [{ number, title, state, url }]

// TODO: Implement getCommitStats(owner, repo, prNumber)
// Fetch file-change statistics for a specific PR.
// Return: { filesChanged, additions, deletions }

// TODO: Implement createDraftRelease(owner, repo, tag, name, body)
// Create a GitHub Release in draft state with the generated changelog.
// Return: { id, url, htmlUrl }

// TODO: Implement checkCIStatus(owner, repo, ref)
// Fetch the combined CI check status for a given ref.
// Return: { state, checks: [{ name, status, conclusion }] }
