import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const jar = join(root, 'dist', `deuterium-${version}.jar`)

mkdirSync(join(root, 'dist'), { recursive: true })
rmSync(jar, { force: true })
execFileSync('zip', ['-r', '-X', '-q', jar, 'META-INF', 'themes', 'colors'], { cwd: join(root, 'resources'), stdio: 'inherit' })

console.log(`Packaged dist/deuterium-${version}.jar`)
