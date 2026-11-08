// Copies the plugin build into the Quarto extension.
//
// `quarto add` copies _extensions/<name>/ straight from this repository, so
// the plugin files have to be committed here. The plugin name comes from this
// repository's package.json: quarto-<name>.
//
//   npm run sync                  From the npm package (a released version).
//   npm run sync -- --local       From ../regular/plugin/<name> (a local build).
//   npm run sync -- --local=PATH  From PATH/plugin/<name>.
//   npm run sync -- --dry-run     Shows what would be copied, and copies nothing.
//
// To update from npm: `npm install reveal.js-<name>@latest`, then `npm run sync`.
// The same file works in every quarto-<name> repository.

import { access, copyFile, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const exists = (path) => access(path).then(() => true, () => false)

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))

const parseArgs = (args) => {
  const local = args.find((arg) => arg === '--local' || arg.startsWith('--local='))
  return {
    dryRun: args.includes('--dry-run'),
    localPath: local ? resolve(root, local.split('=')[1] || '../regular') : null,
  }
}

// The plugin folder and the version it has: a local checkout, or the npm package.
const findSource = async (name, localPath) => {
  const pkgDir = localPath ?? join(root, 'node_modules', `reveal.js-${name}`)
  if (!(await exists(join(pkgDir, 'package.json')))) {
    throw new Error(localPath
      ? `No package.json in ${pkgDir}.`
      : `reveal.js-${name} is not installed. Run npm install first, or use --local.`)
  }
  const { version } = await readJson(join(pkgDir, 'package.json'))
  return { srcDir: join(pkgDir, 'plugin', name), version, label: localPath ? relative(root, pkgDir) : 'npm' }
}

const sync = async () => {
  const { dryRun, localPath } = parseArgs(process.argv.slice(2))
  const { name: repoName } = await readJson(join(root, 'package.json'))
  const name = repoName.replace(/^quarto-/, '')

  const { srcDir, version, label } = await findSource(name, localPath)
  const extDir = join(root, '_extensions', name)

  // The UMD script always, the stylesheet if the plugin has one.
  const files = [`${name}.js`, `${name}.css`]
  if (!(await exists(join(srcDir, files[0])))) throw new Error(`No ${files[0]} in ${srcDir}`)

  const copied = []
  for (const file of files) {
    if (!(await exists(join(srcDir, file)))) continue
    if (!dryRun) await copyFile(join(srcDir, file), join(extDir, file))
    copied.push(file)
  }

  // The extension has the same version as the plugin in it.
  const ymlPath = join(extDir, '_extension.yml')
  const yml = await readFile(ymlPath, 'utf8')
  if (!/^version: .*$/m.test(yml)) throw new Error('No version line in _extension.yml')
  if (!dryRun) await writeFile(ymlPath, yml.replace(/^version: .*$/m, `version: ${version}`))

  const verb = dryRun ? 'Would sync' : '✓ Synced'
  console.log(`${verb} reveal.js-${name} ${version} (${label}) into _extensions/${name}: ${copied.join(', ')}`)
}

sync().catch((error) => {
  console.error('Error syncing plugin files:', error.message)
  process.exit(1)
})
