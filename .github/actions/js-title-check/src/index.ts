import * as core from '@actions/core'

async function run() {
  core.info('I am a custom JS action');
  const basicExecConfig = {
    required: true,
    trimWhitespace: true
  };

  const prTitle = core.getInput('pr-title', basicExecConfig);
  if(prTitle.startsWith('feat')) {
    core.info('PR is feature');
  } else {
    core.warning('PR is not a feature');
  }
}

run();