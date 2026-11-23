import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPOSITORY = 'https://github.com/AndreiDurlea/my-jetbrains-theme'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const jarName = `deuterium-${version}.jar`
const jar = join(root, 'dist', jarName)

mkdirSync(join(root, 'dist'), { recursive: true })
rmSync(jar, { force: true })
execFileSync('zip', ['-r', '-X', '-q', jar, 'META-INF', 'themes', 'colors'], { cwd: join(root, 'resources'), stdio: 'inherit' })

const pluginXml = readFileSync(join(root, 'resources', 'META-INF', 'plugin.xml'), 'utf8')
const tag = name => pluginXml.match(new RegExp(`<${name}>([^<]+)</${name}>`))[1]
const sinceBuild = pluginXml.match(/since-build="([^"]+)"/)[1]

// Custom plugin repository format; IDEs that list this file get each release before Marketplace review ends.
writeFileSync(join(root, 'dist', 'updatePlugins.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<plugins>
  <plugin id="${tag('id')}" url="${REPOSITORY}/releases/download/v${version}/${jarName}" version="${version}">
    <idea-version since-build="${sinceBuild}" />
    <name>${tag('name')}</name>
    <vendor url="${REPOSITORY}">Andrei Durlea</vendor>
  </plugin>
</plugins>
`)

console.log(`Packaged dist/${jarName} and dist/updatePlugins.xml`)
