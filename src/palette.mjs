export const variants = [
  {
    id: 'deuterium',
    name: 'Deuterium',
    file: 'Deuterium',
    background: '#141414',
    accent: '#edf77a',
    accentHover: '#edf77a',
    onAccent: '#141414',
    match: '#edf77a',
  },
  {
    id: 'deuterium-classic',
    name: 'Deuterium Classic',
    file: 'Deuterium_Classic',
    background: '#0d0d0d',
    accent: '#ff4e32',
    accentHover: '#ff6850',
    onAccent: '#ffffff',
    match: '#ff6657',
  },
]

export const syntax = {
  text: '#868686',
  comment: '#6f6f6f',
  keyword: '#f57385',
  string: '#fff498',
  number: '#cd91ff',
  type: '#97e8ec',
  green: '#abf29d',
  mint: '#99ffae',
  invalid: '#f44747',
}

export const ui = {
  foreground: '#f2f2f2',
  control: '#cccccc',
  muted: '#848484',
  dim: '#5e5e5e',
  disabled: '#4f4f4f',
  surface: '#1d1d1d',
  raised: '#252526',
  popup: '#151515',
  selection: '#323232',
  hover: '#282828',
  input: '#3c3c3c',
  border: '#2c2c2c',
  borderStrong: '#3f3f3f',
  focus: '#646464',
  statusBar: '#242424',
  badge: '#4d4d4d',
  link: '#d1d1d1',
  linkActive: '#c2e4ff',
  error: '#f2775e',
  warning: '#f7ca00',
  info: '#75beff',
}

export const editor = {
  lineNumber: '#424242',
  lineNumberActive: '#f8f8f8',
  indentGuide: '#383838',
  indentGuideActive: '#757575',
  ruler: '#363636',
  selection: '#1e1f1f',
  inactiveSelection: '#3a3d41',
  codeLens: '#545454',
  findMatch: '#3b3b3b',
  findMatchBorder: '#8e8d8d',
  bracketMatchBorder: '#888888',
  gutterAdded: '#868686',
  gutterModified: '#606060',
  gutterDeleted: '#ff5e66',
  mergeCurrent: '#27403b',
  mergeIncoming: '#28384b',
}

export const overlays = {
  caretRow: ['#ffffff', 0x0a],
  whitespace: ['#6c6c6c', 0x29],
  findHighlight: ['#5a5a5a', 0x55],
  findHighlightBorder: ['#848484', 0x5e],
  wordHighlight: ['#575757', 0xb8],
  wordHighlightStrong: ['#664c4c', 0xb8],
  bracketMatch: ['#006400', 0x1a],
  fold: ['#3d454d', 0x4d],
  range: ['#ffffff', 0x0b],
  insertedLine: ['#9bb955', 0x33],
  insertedText: ['#3a6a82', 0x52],
  removedLine: ['#ff0000', 0x33],
  conflict: ['#e2c08d', 0x33],
  composeScope: ['#6bb38a', 0x1f],
  breakpoint: ['#ff0000', 0x26],
  executionPoint: ['#ffd700', 0x33],
}

export const vcs = {
  added: '#81b88b',
  modified: '#e2c08d',
  deleted: '#c74e39',
  ignored: '#8c8c8c',
  untracked: '#73c991',
  submodule: '#8db9e2',
  conflict: '#ff0000',
}

export const ansi = {
  black: '#000000',
  red: '#cd3131',
  green: '#0dbc79',
  yellow: '#e5e510',
  blue: '#2472c8',
  magenta: '#bc3fbc',
  cyan: '#11a8cd',
  white: '#e5e5e5',
  brightBlack: '#666666',
  brightRed: '#f14c4c',
  brightGreen: '#23d18b',
  brightYellow: '#f5f543',
  brightBlue: '#3b8eea',
  brightMagenta: '#d670d6',
  brightCyan: '#29b8db',
  brightWhite: '#e5e5e5',
}

export function blend(base, [color, alpha]) {
  const under = toRgb(base)
  const over = toRgb(color)
  const ratio = alpha / 255
  return toHex(under.map((channel, i) => channel + (over[i] - channel) * ratio))
}

function toRgb(hex) {
  const value = parseInt(hex.slice(1, 7), 16)
  return [value >> 16, (value >> 8) & 0xff, value & 0xff]
}

function toHex(rgb) {
  return `#${rgb.map(channel => Math.round(channel).toString(16).padStart(2, '0')).join('')}`
}
