import * as core from '@actions/core'
import * as exec from '@actions/exec'
import github from '@actions/github';

/*
  1. Parsel inputs:
    1.1 base-branch from which to check for updates
    1.2 target-branch to use to create the PR
    1.3 Github Token for authentication purposes (to create PRs)
    1.4 Working directory for which to check for dependencies
  2. Execute the npm-update command within the worfking directory
  3. Check whether there are modified package*.json files
    3.1 If there are modified files, create a PR to the base branch using the target branch with octokit API
  4. Otherwise, conclude the custom action
  */
async function run() {

  core.info('I am a custom JS action');

  const baseBranch = core.getInput('base-branch');
  const targetBranch = core.getInput('target-branch');
  const workingDir = core.getInput('working-directory');
  const debug = core.getBooleanInput('debug');
  const ghToken = core.getInput('gh-token');

  branchNameValidator(baseBranch, 'base-branch');
  branchNameValidator(targetBranch, 'target-branch');
  directoryValidator(workingDir, 'working-directory');

  core.info(`Base branch: ${baseBranch}`);
  core.info(`Target branch: ${targetBranch}`);
  core.info(`Working directory: ${workingDir}`);

  await updatePackages(workingDir);
  const dependenciesStatus = await getDependenciesUpdateStatus(workingDir);
  const statusOut = dependenciesStatus.stdout;

  if (statusOut?.trim()?.length > 0) {
    core.info(`Updates are available: ${statusOut}`);
    await changeCurrentBranch(targetBranch, workingDir);
    await addFilesToStage(['package.json', 'package-lock.json'], workingDir);
    await commit('Commit dependency updates', workingDir);
    await push(targetBranch, workingDir);
    await openPR(ghToken, baseBranch, targetBranch);
  } else {
    core.info('no updates found, bye :P');
    return;
  }



}

function branchNameValidator(value: string, key: string) {
  const regex = /^[a-zA-Z0-9_.\/-]+$/;
  if (!regex.test(value)) {
    core.setFailed(`Invalid ${key} name: ${value}`);
  } else {
    core.info(``)
  }
}

function directoryValidator(value: string, key: string) {
  const regex = /^[a-zA-Z0-9_\/-]+$/;
  if (!regex.test(value)) {
    core.setFailed(`Invalid ${key} name: ${value}`);
  }
}

async function updatePackages(worfkingDir: string) {
  return await exec.exec(`npm update`, [], {
    cwd: worfkingDir,
  });
}

async function getDependenciesUpdateStatus(worfkingDir: string): Promise<exec.ExecOutput> {
  return exec.getExecOutput(`git status -s package*.json`, [], {
    cwd: worfkingDir,
  });
}

async function changeCurrentBranch(targetBranch: string, workingDirectory: string) {
  core.info(`Change the current branch to : ${targetBranch}`)
  exec.exec(`git checkout ${targetBranch}`, [], {
    cwd: workingDirectory
  })
}

async function addFilesToStage(files: string[], workingDirectory: string) {
  exec.exec(`git add -v ${files.join(' ')}`, [], {
    cwd: workingDirectory
  });
}

async function commit(message: string, workingDirectory: string) {
  exec.exec(`git commit -m ${message}`, [], {
    cwd: workingDirectory
  });
}

async function push(branch: string, workingDirectory: string) {
  exec.exec(`git push -u origin ${branch}`, [], {
    cwd: workingDirectory
  });
}

async function openPR(ghToken: string, baseBranch: string, targetBranch: string) {
  const octokit = github.getOctokit(ghToken);

  try {
    await octokit.rest.pulls.create({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      title: `Update NPM dependencies`,
      body: `This pull request updates NPM packages`,
      base: baseBranch,
      head: targetBranch
    });
  } catch (e: unknown) {
    core.error('[js-dependency-update] : Something went wrong while creating the PR. Check logs below.');
    const errorMessage = e instanceof Error ? e.message : String(e);
    core.setFailed(errorMessage);
    core.error(e instanceof Error ? e : new Error(String(e)));
  }
}

run();