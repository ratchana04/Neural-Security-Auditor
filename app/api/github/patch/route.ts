import { Octokit } from "@octokit/rest";

export async function POST(req: Request) {
  try {
    const { repoUrl, patchCode, issueTitle, filePath } = await req.json();
    
    // 1. Validation
    if (!process.env.GITHUB_TOKEN) {
      return Response.json({ error: "GITHUB_TOKEN is missing in .env.local" }, { status: 500 });
    }

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // 2. Parse URL (handles trailing slashes and .git)
    const cleanUrl = repoUrl.replace("https://github.com/", "").replace(/\/$/, "").replace(".git", "");
    const [owner, repo] = cleanUrl.split("/");

    if (!owner || !repo) {
      return Response.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }

    const branchName = `security-fix-${Date.now()}`;
    const targetFile = filePath || "security-patch-fix.ts";

    // 3. Get Repository Data to find the default branch
    const { data: repoData } = await octokit.repos.get({ owner, repo });
    const defaultBranch = repoData.default_branch;

    // 4. Get the SHA of the latest commit on the default branch
    const { data: ref } = await octokit.git.getRef({ 
      owner, 
      repo, 
      ref: `heads/${defaultBranch}` 
    });
    
    // 5. Create a new branch
    await octokit.git.createRef({ 
      owner, 
      repo, 
      ref: `refs/heads/${branchName}`, 
      sha: ref.object.sha 
    });

    // 6. Check if file exists to get its SHA (required for updating)
    let currentFileSha;
    try {
      const { data: fileData }: any = await octokit.repos.getContent({
        owner, repo, path: targetFile, ref: defaultBranch
      });
      currentFileSha = fileData.sha;
    } catch (e) {
      // File doesn't exist, will be created as new
    }

    // 7. Commit the patch code (Content MUST be base64)
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: targetFile,
      message: `🛡️ Neural Auditor: ${issueTitle}`,
      content: Buffer.from(patchCode).toString("base64"),
      branch: branchName,
      sha: currentFileSha,
    });

    // 8. Create the Pull Request
    const pr = await octokit.pulls.create({
      owner, 
      repo, 
      title: `🛡️ Security Fix: ${issueTitle}`,
      head: branchName, 
      base: defaultBranch,
      body: `### 🤖 AI-Generated Patch\n\nThis PR fixes a vulnerability identified by **Neural Auditor**.\n\n**Issue:** ${issueTitle}`
    });

    return Response.json({ url: pr.data.html_url });

  } catch (error: any) {
    console.error("GITHUB ERROR:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}