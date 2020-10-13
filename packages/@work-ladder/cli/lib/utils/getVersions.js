const { semver } = require('@work-ladder/cli-shared-utils')

let sessionCached
module.exports = async function getVersions() {
  if (sessionCached) {
    return sessionCached
  }

  const local = require('../../package.json').version
  return local
}
