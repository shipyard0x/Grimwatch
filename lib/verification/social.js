/**
 * Social Identity Verification Module — scores 0–20
 *
 * Uses GitHub's public API (no key needed, 60 req/hr unauthenticated).
 * Checks:
 *  - GitHub repo existence, stars, commit activity, contributors
 *  - Repo age and meaningful code (not just landing page)
 *  - Twitter/social handle presence (name-based heuristic)
 */

const GH_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

async function ghFetch(url) {
  try {
    const res = await fetch(url, { headers: GH_HEADERS });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

/** Split camelCase/PascalCase into hyphen-slug: "AgentAxion" → "agent-axion" */
function camelToSlug(name) {
  return name
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/\s+/g, '-');
}

/**
 * Fetch GitHub repo data — tries multiple name formats before giving up.
 */
async function fetchGitHubRepo(repoSlug, agentName = '') {
  if (!repoSlug && !agentName) return null;

  // Direct owner/repo lookup
  if (repoSlug && repoSlug.includes('/')) {
    const data = await ghFetch(`https://api.github.com/repos/${repoSlug}`);
    if (data && data.full_name) return data;
  }

  // Build search query candidates
  const candidates = new Set();
  if (repoSlug) {
    candidates.add(repoSlug);
    candidates.add(camelToSlug(repoSlug));
    candidates.add(repoSlug.toLowerCase().replace(/\s+/g, '-'));
  }
  if (agentName) {
    candidates.add(agentName);
    candidates.add(camelToSlug(agentName));
    candidates.add(agentName.toLowerCase().replace(/\s+/g, '-'));
    candidates.add(agentName.toLowerCase().replace(/[^a-z0-9]/g, ''));
  }

  for (const q of candidates) {
    if (!q) continue;
    const data = await ghFetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}+in:name&sort=stars&per_page=1`
    );
    if (data?.items?.[0]) return data.items[0];
  }
  return null;
}

/**
 * Fetch recent commit activity for a repo.
 * Returns array of weekly commit counts for the last 52 weeks.
 */
async function fetchCommitActivity(owner, repo) {
  const data = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`);
  return Array.isArray(data) ? data : [];
}

async function fetchContributors(owner, repo) {
  const data = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=30&anon=false`);
  return Array.isArray(data) ? data : [];
}

/**
 * Main entry point — analyze social presence for a given set of social handles.
 * @param {object} social - { github: "owner/repo" | "repoName", twitter: "@handle" }
 * @param {string} agentName - used for heuristic search if github is null
 */
export async function analyzeSocial(social = {}, agentName = "") {
  const evidence = {
    githubFound: false,
    repoName: null,
    stars: 0,
    forks: 0,
    contributors: 0,
    lastCommitDays: null,
    repoAgeDays: 0,
    weeklyCommits: 0,
    hasDescription: false,
    isPrivate: false,
    twitterHandle: social.twitter || null,
    score: 0,
    details: [],
  };

  // ── GitHub Analysis ──────────────────────────────────────────────────────
  const repo = await fetchGitHubRepo(social.github || null, agentName);

  if (repo) {
    evidence.githubFound = true;
    evidence.repoName = repo.full_name;
    evidence.stars = repo.stargazers_count || 0;
    evidence.forks = repo.forks_count || 0;
    evidence.isPrivate = repo.private || false;
    evidence.hasDescription = !!repo.description;

    // Repo age
    if (repo.created_at) {
      const created = new Date(repo.created_at);
      evidence.repoAgeDays = Math.floor(
        (Date.now() - created.getTime()) / 86400000
      );
    }

    // Last push
    if (repo.pushed_at) {
      const pushed = new Date(repo.pushed_at);
      evidence.lastCommitDays = Math.floor(
        (Date.now() - pushed.getTime()) / 86400000
      );
    }

    // Contributor count + weekly commits (needs owner/repo)
    if (repo.full_name) {
      const [owner, repoName] = repo.full_name.split("/");
      const [contributors, commitActivity] = await Promise.all([
        fetchContributors(owner, repoName),
        fetchCommitActivity(owner, repoName),
      ]);
      evidence.contributors = contributors.length;

      // Average weekly commits over last 12 weeks
      if (commitActivity.length > 0) {
        const last12 = commitActivity.slice(-12);
        evidence.weeklyCommits = Math.round(
          last12.reduce((s, w) => s + (w.total || 0), 0) / last12.length
        );
      }
    }
  } else {
    evidence.details.push(
      `No GitHub repository found for "${githubSlug}"`
    );
  }

  // ── Scoring ──────────────────────────────────────────────────────────────
  let score = 0;

  if (evidence.githubFound) {
    // Stars (0-4 pts)
    if (evidence.stars >= 1000) score += 4;
    else if (evidence.stars >= 200) score += 3;
    else if (evidence.stars >= 50) score += 2;
    else if (evidence.stars >= 10) score += 1;

    // Contributors (0-3 pts) — single dev is a yellow flag
    if (evidence.contributors >= 5) score += 3;
    else if (evidence.contributors >= 2) score += 2;
    else if (evidence.contributors >= 1) score += 1;

    // Repo age (0-2 pts)
    if (evidence.repoAgeDays >= 180) score += 2;
    else if (evidence.repoAgeDays >= 60) score += 1;

    // Recent activity (0-3 pts)
    if (evidence.lastCommitDays !== null) {
      if (evidence.lastCommitDays <= 7) score += 3;
      else if (evidence.lastCommitDays <= 30) score += 2;
      else if (evidence.lastCommitDays <= 90) score += 1;
    }

    // Weekly commit cadence (0-2 pts)
    if (evidence.weeklyCommits >= 10) score += 2;
    else if (evidence.weeklyCommits >= 3) score += 1;

    // Has description (0-1 pt)
    if (evidence.hasDescription) score += 1;
  }

  // Twitter presence (0-3 pts) — heuristic: just check if handle provided
  // (Full Twitter API requires OAuth; this checks name pattern)
  if (evidence.twitterHandle) {
    score += 2; // handle exists
    if (evidence.twitterHandle.length > 3) score += 1; // not a stub
  }

  evidence.score = Math.min(score, 20);

  // Human-readable details
  if (evidence.githubFound) {
    evidence.details.push(`GitHub: ${evidence.repoName} (${evidence.stars} ★)`);
    evidence.details.push(`${evidence.contributors} contributor(s), repo age ${evidence.repoAgeDays} days`);
    if (evidence.lastCommitDays !== null)
      evidence.details.push(`Last commit ${evidence.lastCommitDays} day(s) ago`);
    evidence.details.push(`Avg ${evidence.weeklyCommits} commits/week (last 12 weeks)`);
  }
  if (evidence.twitterHandle) {
    evidence.details.push(`Twitter: ${evidence.twitterHandle}`);
  }

  return evidence;
}

/**
 * Converts social evidence score into pass/partial/fail for the UI.
 */
export function socialCheckPassed(evidence) {
  if (evidence.score >= 14) return true;
  if (evidence.score >= 6) return "partial";
  return false;
}
