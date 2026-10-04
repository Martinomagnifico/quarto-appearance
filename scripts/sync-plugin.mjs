// Copies the published plugin build into the Quarto extension.
//
// `quarto add` copies _extensions/<name>/ straight from this repository, so
// the plugin files have to be committed here. They come from the npm package
// rather than from a local checkout, so the extension always ships a released
// version. Update with:
//
//   npm install reveal.js-<name>@latest
//   npm run sync
//
// The plugin name comes from this repository's package.json: quarto-<name>.

import { access, copyFile, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const exists = (path) => access(path).then(() => true, () => false)

const sync = async () => {
  const { name: repoName } = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
  const name = repoName.replace(/^quarto-/, '')

  const pkgDir = join(root, 'node_modules', `reveal.js-${name}`)
  if (!(await exists(pkgDir))) {
    throw new Error(`reveal.js-${name} is not installed. Run npm install first.`)
  }
  const { version } = JSON.parse(await readFile(join(pkgDir, 'package.json'), 'utf8'))

  const srcDir = join(pkgDir, 'plugin', name)
  const extDir = join(root, '_extensions', name)

  // The UMD script always, the stylesheet when the plugin has one.
  const files = [`${name}.js`, `${name}.css`]
  if (!(await exists(join(srcDir, files[0])))) throw new Error(`No ${files[0]} in ${srcDir}`)

  for (const file of files) {
    if (await exists(join(srcDir, file))) {
      await copyFile(join(srcDir, file), join(extDir, file))
    }
  }

  // Keep the extension's version the same as the plugin it ships.
  const ymlPath = join(extDir, '_extension.yml')
  const yml = await readFile(ymlPath, 'utf8')
  if (!/^version: .*$/m.test(yml)) throw new Error('No version line in _extension.yml')
  await writeFile(ymlPath, yml.replace(/^version: .*$/m, `version: ${version}`))

  console.log(`✓ Synced reveal.js-${name} ${version} into _extensions/${name}`)
}

sync().catch((error) => {
  console.error('Error syncing plugin files:', error.message)
  process.exit(1)
})
