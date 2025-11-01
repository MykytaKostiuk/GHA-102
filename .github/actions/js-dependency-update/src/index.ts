import core from '@actions/core';
import exec from '@actions/exec';

async function run() {
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
  core.info('I am a custom JS action');

  const baseBranch = core.getInput('base-branch');
  const targetBranch = core.getInput('target-branch');
  const workingDirectory = core.getInput('working-directory');
  const debug = core.getBooleanInput('debug');
  const ghToken = core.getInput('gh-token');

  branchNameValidator(baseBranch, 'base-branch');
  branchNameValidator(targetBranch, 'target-branch');
  directoryValidator(workingDirectory, 'working-directory');
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

run();