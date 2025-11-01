import * as core from '@actions/core'
import * as exec from '@actions/exec'

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

  core.info(`Base branch: ${baseBranch}`);
  core.info(`Target branch: ${targetBranch}`);
  core.info(`Working directory: ${workingDirectory}`);

  await exec.exec('echo "Current directory:"');
  await exec.exec('pwd');
  await exec.exec(`cd ${workingDirectory}`);
  await exec.exec('echo "Current directory:" $(pwd)');
  updatePackages();
  const dependenciesStatus = await getDependenciesUpdateStatus();
  const statusOut = dependenciesStatus.stdout;
  core.info(`Dependencies Status: ${statusOut}`);

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

async function updatePackages() {
  const out = await exec.getExecOutput(`npm update`);
  core.info(`OUT [npm update]: ${out}`)
}

async function getDependenciesUpdateStatus(): Promise<exec.ExecOutput> {
  const out = await exec.getExecOutput(`git status -s package*.json`);
  return out;
}

run();