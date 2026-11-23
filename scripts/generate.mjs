import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { variants } from '../src/palette.mjs'
import { editorScheme, schemeXml } from '../src/scheme.mjs'
import { uiTheme } from '../src/ui.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'resources')
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

const PLUGIN_ID = 'com.andreidurlea.deuterium'
const SINCE_BUILD = '253'

rmSync(out, { recursive: true, force: true })
for (const dir of ['META-INF', 'themes', 'colors']) mkdirSync(join(out, dir), { recursive: true })

for (const variant of variants) {
  writeFileSync(join(out, 'themes', `${variant.file}.theme.json`), `${JSON.stringify(uiTheme(variant), null, 2)}\n`)
  writeFileSync(join(out, 'colors', `${variant.file}.xml`), schemeXml(editorScheme(variant)))
}

copyFileSync(join(root, 'images', 'deuterium-square.svg'), join(out, 'META-INF', 'pluginIcon.svg'))
copyFileSync(join(root, 'LICENSE'), join(out, 'META-INF', 'LICENSE'))
copyFileSync(join(root, 'vendor', 'lotus-theme-jetbrains', 'LICENSE'), join(out, 'META-INF', 'LICENSE-lotus-theme-jetbrains'))

const providers = variants
  .map(variant => `    <themeProvider id="andreidurlea.${variant.id}" path="/themes/${variant.file}.theme.json" />`)
  .join('\n')

writeFileSync(join(out, 'META-INF', 'plugin.xml'), `<idea-plugin>
  <id>${PLUGIN_ID}</id>
  <name>Deuterium</name>
  <version>${version}</version>
  <vendor url="https://github.com/AndreiDurlea/my-jetbrains-theme">Andrei Durlea</vendor>
  <idea-version since-build="${SINCE_BUILD}" />
  <description><![CDATA[
    <p>Two dark UI themes for the Islands UI, each with an editor color scheme of the same name, using the backgrounds and accents of the Deuterium themes for VS Code.</p>
    <ul>
      <li>Deuterium uses a #0d0d0d editor background and the Infrared (#ff4e32) accent.</li>
      <li>Deuterium Lite uses a #141414 editor background and the Limelight (#edf77a) accent.</li>
    </ul>
    <p>Syntax colors follow Lotus Dark (Classic) by Brian Lai, used under the MIT License. Select a theme in Settings, Appearance &amp; Behavior, Appearance, Theme; its editor color scheme is selected with it.</p>
  ]]></description>
  <depends>com.intellij.modules.platform</depends>
  <extensions defaultExtensionNs="com.intellij">
${providers}
  </extensions>
</idea-plugin>
`)

console.log(`Generated Deuterium ${version} into resources/`)
