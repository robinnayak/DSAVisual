// components/GitCheatSheet.js

import React from 'react';

const GitCheatSheet = () => {
  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-6">Git Cheat Sheet for Real-World Use</h1>

      {/* Problem 1 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">🧩 PROBLEM 1: Start a Clean Feature Branch from `main`</h2>
        <p><strong>Goal:</strong> You’ve made messy local changes or are on a different branch. You want to:</p>
        <ul>
          <li>Discard local changes</li>
          <li>Get the latest `main`</li>
          <li>Create a new branch to start fresh</li>
        </ul>
        <h3 className="font-semibold">Steps:</h3>
        <pre className="bg-gray-100 p-3 rounded">
          {`# 1. Go to main branch
git checkout main

# 2. Fetch latest updates from remote
git fetch origin

# 3. Reset local main to match remote main
git reset --hard origin/main

# 4. Create a new branch from clean main
git checkout -b feature/new-idea`}
        </pre>
        <p><strong>Usage:</strong> Start a bug fix or feature cleanly even if your repo was messy or behind.</p>
      </section>

      {/* Problem 2 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">🧩 PROBLEM 2: Stash Local Changes Temporarily</h2>
        <p><strong>Goal:</strong> You’re mid-work but need to switch branches without committing messy/incomplete work.</p>
        <h3 className="font-semibold">Steps:</h3>
        <pre className="bg-gray-100 p-3 rounded">
          {`git stash
# switch branches
git checkout other-branch
# later restore changes
git stash pop`}
        </pre>
        <p><strong>Usage:</strong> Useful for urgent bug fixes on another branch while preserving current work.</p>
      </section>

      {/* Problem 3 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">🧩 PROBLEM 3: Undo All Local Changes (Untracked + Tracked)</h2>
        <p><strong>Goal:</strong> You want to wipe your working directory completely to match HEAD.</p>
        <h3 className="font-semibold">Steps:</h3>
        <pre className="bg-gray-100 p-3 rounded">
          {`# 1. Remove untracked files/folders
git clean -fd

# 2. Discard tracked file changes
git reset --hard`}
        </pre>
        <p><strong>Usage:</strong> When your workspace is cluttered and you want to start fresh without creating a new clone.</p>
      </section>

      {/* Problem 4 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">🧩 PROBLEM 4: Update Your Feature Branch with Latest `main`</h2>
        <p><strong>Goal:</strong> Your feature branch is behind `main`. You want to bring in the latest changes without losing your commits.</p>
        <h3 className="font-semibold">Steps:</h3>
        <pre className="bg-gray-100 p-3 rounded">
          {`git checkout main
git pull origin main

# Now go back to feature
git checkout feature/my-feature

# Rebase instead of merge (keeps clean history)
git rebase main`}
        </pre>
        <p><strong>Usage:</strong> Keep your branch up to date before merging or creating a pull request.</p>
      </section>

      {/* Problem 5 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">🧩 PROBLEM 5: Create and Push a New Branch to Remote</h2>
        <p><strong>Goal:</strong> You created a local branch and want to publish it.</p>
        <h3 className="font-semibold">Steps:</h3>
        <pre className="bg-gray-100 p-3 rounded">
          {`git checkout -b feature/awesome
git push -u origin feature/awesome`}
        </pre>
        <p><strong>Usage:</strong> The `-u` flag links the local branch to the remote for future pushes.</p>
      </section>

      {/* Problem 6 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">🧩 PROBLEM 6: Delete a Branch (Local and Remote)</h2>
        <p><strong>Goal:</strong> You no longer need a branch and want to clean up.</p>
        <h3 className="font-semibold">Steps:</h3>
        <pre className="bg-gray-100 p-3 rounded">
          {`# Delete locally
git branch -d feature/old

# Delete on remote
git push origin --delete feature/old`}
        </pre>
      </section>

      {/* Problem 7 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">🧩 PROBLEM 7: Undo Last Commit but Keep Changes</h2>
        <p><strong>Goal:</strong> You committed something by mistake but don’t want to lose your work.</p>
        <h3 className="font-semibold">Steps:</h3>
        <pre className="bg-gray-100 p-3 rounded">
          {`git reset --soft HEAD~1`}
        </pre>
        <p><strong>Usage:</strong> Perfect for fixing commit messages or combining into another commit.</p>
      </section>

      {/* Problem 8 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">🧩 PROBLEM 8: Clone a Specific Branch Only</h2>
        <p><strong>Goal:</strong> You only want one branch from a huge repo.</p>
        <h3 className="font-semibold">Steps:</h3>
        <pre className="bg-gray-100 p-3 rounded">
          {`git clone --single-branch --branch feature/branch-name https://github.com/user/repo.git`}
        </pre>
      </section>

      {/* Problem 9 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">🧩 PROBLEM 9: See What Changed in a Branch Compared to `main`</h2>
        <p><strong>Goal:</strong> You want to review differences before creating a PR.</p>
        <h3 className="font-semibold">Steps:</h3>
        <pre className="bg-gray-100 p-3 rounded">
          {`git diff main..feature/your-branch`}
        </pre>
      </section>

      {/* Problem 10 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">🧩 PROBLEM 10: Fix Detached HEAD State</h2>
        <p><strong>Goal:</strong> You re in a detached HEAD state (e.g., checked out a commit directly) and want to get back to a branch.</p>
        <h3 className="font-semibold">Steps:</h3>
        <pre className="bg-gray-100 p-3 rounded">
          {`# Create a branch from the current detached HEAD
git checkout -b feature/fix-detached`}
        </pre>
      </section>

      {/* Add styles for better design */}
      <style jsx>{`
        .container {
          max-width: 900px;
        }
        h2 {
          color: #333;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default GitCheatSheet;
