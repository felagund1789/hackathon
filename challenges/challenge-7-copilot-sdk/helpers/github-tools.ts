// GitHub Tools
// Utility functions for fetching release-related data from the GitHub API.
// Your challenge: implement these tools and register them with the Copilot SDK session.

import { Octokit } from "@octokit/rest";

/**
 * Create an authenticated Octokit client.
 * Uses GITHUB_TOKEN from the environment.
 */
export function createOctokit(): Octokit {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  return new Octokit({ auth: token });
}

// TODO: Implement getMergedPRs(owner, repo, since)
// Fetch all pull requests merged since a given tag, date, or commit SHA.
// Return a simplified array: [{ number, title, body, labels, author, mergedAt, url }]
//
// Hint: Use octokit.rest.pulls.list({ owner, repo, state: "closed", sort: "updated" })
// then filter by merged_at date. For tag-based lookups, first resolve the tag to a date
// using octokit.rest.git.getTag() or octokit.rest.repos.listTags().

// TODO: Implement getLinkedIssues(owner, repo, prNumber)
// For a given PR, fetch the issues referenced in its body or linked via the timeline API.
// Return a simplified array: [{ number, title, state, url }]
//
// Hint: Use octokit.rest.issues.listEventsForTimeline() and filter for cross-reference events,
// or parse issue references (#123) from the PR body.

// TODO: Implement getCommitStats(owner, repo, prNumber)
// Fetch file-change statistics for a specific PR.
// Return: { filesChanged: number, additions: number, deletions: number }
//
// Hint: Use octokit.rest.pulls.get({ owner, repo, pull_number }) -- the response
// includes changed_files, additions, and deletions.

// TODO: Implement createDraftRelease(owner, repo, tag, name, body)
// Create a GitHub Release in draft state with the generated changelog as the body.
// Return: { id, url, htmlUrl }
//
// Hint: Use octokit.rest.repos.createRelease({ owner, repo, tag_name, name, body, draft: true })

// TODO: Implement checkCIStatus(owner, repo, ref)
// Fetch the combined CI check status for a given ref (branch, tag, or SHA).
// Return: { state: "success" | "failure" | "pending", checks: [{ name, status, conclusion }] }
//
// Hint: Use octokit.rest.repos.getCombinedStatusForRef() and
// octokit.rest.checks.listForRef() for GitHub Actions checks.
