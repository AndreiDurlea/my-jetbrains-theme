import { readFileSync } from 'node:fs'
import { syntax as s, ui, editor, overlays, vcs, ansi, blend } from './palette.mjs'

const BOLD = 1
const ITALIC = 2
const BOLD_ITALIC = 3

const BOX = 0
const UNDERLINE = 1
const WAVE = 2
const STRIKEOUT = 3
const BOLD_DOTTED = 5

const LOTUS_SCHEME = new URL('../vendor/lotus-theme-jetbrains/Lotus_Dark.xml', import.meta.url)

// Darcula colors @Composable calls #6bb38a and Lotus Dark leaves the key unset; pinning it keeps
// the color stable if the IDE default changes.
const COMPOSABLE_CALL = '#6bb38a'

export function editorScheme(variant) {
  const bg = variant.background
  const over = name => blend(bg, overlays[name])
  const tint = (color, alpha) => blend(bg, [color, alpha])

  const colors = {
    CARET_COLOR: '#ffffff',
    CARET_ROW_COLOR: over('caretRow'),
    SELECTION_BACKGROUND: editor.selection,
    SELECTION_BACKGROUND_INACTIVE: editor.inactiveSelection,
    SELECTION_FOREGROUND: '',
    GUTTER_BACKGROUND: bg,
    CONSOLE_BACKGROUND_KEY: bg,
    LINE_NUMBERS_COLOR: editor.lineNumber,
    LINE_NUMBER_ON_CARET_ROW_COLOR: editor.lineNumberActive,
    INDENT_GUIDE: editor.indentGuide,
    SELECTED_INDENT_GUIDE: editor.indentGuideActive,
    VISUAL_INDENT_GUIDE: editor.indentGuide,
    MATCHED_BRACES_INDENT_GUIDE_COLOR: editor.indentGuideActive,
    STRING_CONTENT_INDENT_GUIDE: editor.indentGuide,
    DOC_COMMENT_GUIDE: editor.indentGuide,
    DOC_COMMENT_LINK: s.type,
    WHITESPACES: over('whitespace'),
    RIGHT_MARGIN_COLOR: editor.ruler,
    METHOD_SEPARATORS_COLOR: editor.indentGuide,
    TEARLINE_COLOR: editor.ruler,
    SELECTED_TEARLINE_COLOR: editor.indentGuideActive,
    SOFT_WRAP_SIGN_COLOR: editor.lineNumber,
    FOLDED_TEXT_BORDER_COLOR: editor.indentGuide,
    RECENT_LOCATIONS_SELECTION: ui.selection,
    RECURSIVE_CALL_ATTRIBUTES: tint(s.mint, 0x26),
    ADDED_LINES_COLOR: editor.gutterAdded,
    MODIFIED_LINES_COLOR: editor.gutterModified,
    DELETED_LINES_COLOR: editor.gutterDeleted,
    WHITESPACES_MODIFIED_LINES_COLOR: editor.gutterModified,
    IGNORED_ADDED_LINES_BORDER_COLOR: editor.gutterAdded,
    IGNORED_MODIFIED_LINES_BORDER_COLOR: editor.gutterModified,
    IGNORED_DELETED_LINES_BORDER_COLOR: editor.gutterDeleted,
    DIFF_SEPARATORS_BACKGROUND: ui.surface,
    DIFF_SEPARATOR_WAVE: editor.codeLens,
    ANNOTATIONS_COLOR: ui.muted,
    ANNOTATIONS_LAST_COMMIT_COLOR: ui.control,
    VCS_ANNOTATIONS_COLOR_1: tint('#ffffff', 0x14),
    VCS_ANNOTATIONS_COLOR_2: tint('#ffffff', 0x10),
    VCS_ANNOTATIONS_COLOR_3: tint('#ffffff', 0x0c),
    VCS_ANNOTATIONS_COLOR_4: tint('#ffffff', 0x08),
    VCS_ANNOTATIONS_COLOR_5: tint('#ffffff', 0x04),
    DOCUMENTATION_COLOR: ui.raised,
    LOOKUP_COLOR: ui.raised,
    NOTIFICATION_BACKGROUND: ui.surface,
    INFORMATION_HINT: ui.surface,
    QUESTION_HINT: ui.surface,
    PROMOTION_PANE: ui.surface,
    ERROR_HINT: tint(ui.error, 0x33),
    HINT_BORDER: ui.borderStrong,
    MODIFIED_TAB_ICON: variant.accent,
    FILESTATUS_ADDED: vcs.added,
    FILESTATUS_COPIED: vcs.added,
    FILESTATUS_addedOutside: vcs.added,
    FILESTATUS_MODIFIED: vcs.modified,
    FILESTATUS_modifiedOutside: vcs.modified,
    FILESTATUS_MERGED: vcs.modified,
    FILESTATUS_NOT_CHANGED_IMMEDIATE: vcs.modified,
    FILESTATUS_NOT_CHANGED_RECURSIVE: vcs.modified,
    FILESTATUS_RENAMED: vcs.untracked,
    FILESTATUS_UNKNOWN: vcs.untracked,
    FILESTATUS_DELETED: vcs.deleted,
    FILESTATUS_IDEA_FILESTATUS_DELETED_FROM_FILE_SYSTEM: vcs.deleted,
    FILESTATUS_IDEA_FILESTATUS_IGNORED: vcs.ignored,
    'FILESTATUS_IGNORE.PROJECT_VIEW.IGNORED': vcs.ignored,
    FILESTATUS_IDEA_FILESTATUS_MERGED_WITH_CONFLICTS: vcs.conflict,
    FILESTATUS_IDEA_FILESTATUS_MERGED_WITH_BOTH_CONFLICTS: vcs.conflict,
    FILESTATUS_IDEA_FILESTATUS_MERGED_WITH_PROPERTY_CONFLICTS: vcs.conflict,
    FILESTATUS_changelistConflict: vcs.conflict,
    FILESTATUS_IDEA_SVN_FILESTATUS_EXTERNAL: vcs.submodule,
    BLOCK_TERMINAL_BLOCK_BACKGROUND_START: bg,
    BLOCK_TERMINAL_BLOCK_BACKGROUND_END: bg,
    BLOCK_TERMINAL_SELECTED_BLOCK_BACKGROUND: ui.selection,
    BLOCK_TERMINAL_SELECTED_BLOCK_STROKE_COLOR: ui.focus,
    BLOCK_TERMINAL_INACTIVE_SELECTED_BLOCK_BACKGROUND: ui.surface,
    BLOCK_TERMINAL_INACTIVE_SELECTED_BLOCK_STROKE_COLOR: ui.borderStrong,
    BLOCK_TERMINAL_ERROR_BLOCK_STROKE_COLOR: ui.error,
    BLOCK_TERMINAL_PROMPT_SEPARATOR_COLOR: ui.border,
    'ScrollBar.Mac.thumbColor': '#79797966',
    'ScrollBar.Mac.hoverThumbColor': '#646464b3',
    'ScrollBar.Mac.Transparent.thumbColor': '#79797900',
    'ScrollBar.Mac.Transparent.hoverThumbColor': '#646464b3',
    'ScrollBar.thumbColor': '#79797966',
    'ScrollBar.hoverThumbColor': '#646464b3',
    'ScrollBar.Transparent.thumbColor': '#79797966',
    'ScrollBar.Transparent.hoverThumbColor': '#646464b3',
  }

  const inlay = { fg: s.comment, bg: ui.surface }
  const consoleColor = color => ({ fg: color })

  const chrome = [
    [['ComposeStateReadScopeHighlightingTextAttributes'], { bg: over('composeScope') }],
    [['MATCHED_TAG_NAME', 'REGEXP_MATCHED_GROUPS'], { bg: over('wordHighlight') }],
    [['KOTLIN_DEBUG_INFO', 'KOTLIN_RESOLVED_TO_ERROR'], { effect: [BOX, ui.error] }],

    [['ERRORS_ATTRIBUTES', 'FILESTATUS_ERRORS'], { effect: [WAVE, ui.error], stripe: ui.error }],
    [['WRONG_REFERENCES_ATTRIBUTES'], { fg: ui.error }],
    [['WARNING_ATTRIBUTES', 'GENERIC_SERVER_ERROR_OR_WARNING'], { effect: [WAVE, ui.warning], stripe: ui.warning }],
    [['INFO_ATTRIBUTES'], { effect: [WAVE, s.text], stripe: s.text }],
    [['TYPO', 'GRAMMAR_ERROR'], { effect: [WAVE, s.comment] }],
    [['TEXT_STYLE_ERROR', 'TEXT_STYLE_WARNING', 'TEXT_STYLE_SUGGESTION'], { effect: [BOLD_DOTTED, s.comment] }],
    [['RUNTIME_ERROR'], { effect: [BOLD_DOTTED, ui.error], stripe: ui.error }],
    [['BAD_CHARACTER'], { fg: s.invalid, effect: [WAVE, s.invalid] }],
    [['DEPRECATED_ATTRIBUTES'], { effect: [STRIKEOUT, s.text] }],
    [['MARKED_FOR_REMOVAL_ATTRIBUTES'], { effect: [STRIKEOUT, ui.error] }],
    [['NOT_USED_ELEMENT_ATTRIBUTES', 'CONDITIONALLY_NOT_COMPILED'], { fg: ui.dim }],
    [['Unresolved reference access'], { fg: ui.dim, effect: [BOLD_DOTTED, ui.dim] }],

    [['IDENTIFIER_UNDER_CARET_ATTRIBUTES'], { bg: over('wordHighlight'), stripe: s.text }],
    [['WRITE_IDENTIFIER_UNDER_CARET_ATTRIBUTES'], { bg: over('wordHighlightStrong'), stripe: s.keyword }],
    [['TEXT_SEARCH_RESULT_ATTRIBUTES'], { bg: over('findHighlight'), effect: [BOX, over('findHighlightBorder')], stripe: editor.findMatchBorder }],
    [['SEARCH_RESULT_ATTRIBUTES'], { bg: editor.findMatch, stripe: editor.findMatchBorder }],
    [['WRITE_SEARCH_RESULT_ATTRIBUTES'], { bg: over('wordHighlightStrong'), stripe: s.keyword }],
    [['MATCHED_BRACE_ATTRIBUTES'], { bg: over('bracketMatch'), effect: [BOX, editor.bracketMatchBorder] }],
    [['UNMATCHED_BRACE_ATTRIBUTES'], { bg: tint(ui.error, 0x40) }],
    [['BLINKING_HIGHLIGHTS_ATTRIBUTES'], { effect: [BOX, ui.focus] }],
    [['BOOKMARKS_ATTRIBUTES'], { stripe: ui.link }],
    [['FOLDED_TEXT_ATTRIBUTES'], { fg: s.text, bg: over('fold') }],
    [['INJECTED_LANGUAGE_FRAGMENT'], { bg: over('range') }],
    [['LIVE_TEMPLATE_ATTRIBUTES'], { effect: [BOX, variant.accent] }],
    [['LIVE_TEMPLATE_INACTIVE_SEGMENT'], { effect: [BOX, ui.focus] }],
    [['TEMPLATE_VARIABLE_ATTRIBUTES'], { fg: s.number }],
    [['HYPERLINK_ATTRIBUTES'], { fg: ui.link, effect: [UNDERLINE, ui.link] }],
    [['FOLLOWED_HYPERLINK_ATTRIBUTES'], { fg: ui.muted, effect: [UNDERLINE, ui.muted] }],
    [['INACTIVE_HYPERLINK_ATTRIBUTES'], { effect: [UNDERLINE, ui.dim] }],
    [['CTRL_CLICKABLE'], { fg: ui.linkActive, effect: [UNDERLINE, ui.linkActive] }],
    [['DUPLICATE_FROM_SERVER'], { bg: tint(ui.warning, 0x26) }],
    [['LiveLiteralsHighlightAttribute'], { effect: [BOX, editor.codeLens] }],
    [['CODE_LENS_BORDER_COLOR'], { effect: [BOX, editor.codeLens] }],

    [['INLINE_PARAMETER_HINT', 'INLAY_DEFAULT'], inlay],
    [['INLINE_PARAMETER_HINT_HIGHLIGHTED'], { fg: ui.control, bg: ui.raised }],
    [['INLINE_PARAMETER_HINT_CURRENT'], { fg: ui.control, bg: ui.selection }],
    [['INLAY_TEXT_WITHOUT_BACKGROUND', 'INLINE_SUGGESTION'], { fg: s.comment }],
    [['INLAY_BUTTON_DEFAULT', 'INLAY_BUTTON_FOCUSED', 'INLAY_BUTTON_HOVERED', 'AI_INLAY_BUTTON_DEFAULT', 'AI_INLAY_BUTTON_FOCUSED', 'AI_INLAY_BUTTON_HOVERED'], { fg: ui.muted }],
    [['INLAY_BUTTON_HINT'], { fg: ui.dim }],
    [['DOC_CODE_INLINE'], { fg: s.string, bg: ui.surface }],
    [['DOC_CODE_BLOCK'], { fg: s.text, bg: ui.surface }],
    [['DOC_TIPS_SHORTCUT'], { fg: ui.control, effect: [BOX, ui.borderStrong] }],

    [['BREADCRUMBS_DEFAULT', 'BREADCRUMBS_INACTIVE'], { fg: ui.muted }],
    [['BREADCRUMBS_CURRENT'], { fg: '#e0e0e0', bg: ui.surface }],
    [['BREADCRUMBS_HOVERED'], { fg: '#e0e0e0', bg: ui.hover }],

    [['BREAKPOINT_ATTRIBUTES'], { bg: over('breakpoint') }],
    [['EXECUTIONPOINT_ATTRIBUTES'], { bg: over('executionPoint') }],
    [['NOT_TOP_FRAME_ATTRIBUTES'], { bg: ui.surface }],
    [['INLINE_STACK_FRAMES'], { bg: ui.surface }],
    [['EVALUATED_EXPRESSION_ATTRIBUTES', 'EVALUATED_EXPRESSION_EXECUTION_LINE_ATTRIBUTES'], { bg: ui.selection }],
    [['DEBUGGER_INLINED_VALUES'], { fg: s.comment, font: ITALIC }],
    [['DEBUGGER_INLINED_VALUES_EXECUTION_LINE'], { fg: ui.control, font: ITALIC }],
    [['DEBUGGER_INLINED_VALUES_MODIFIED'], { fg: s.string, font: ITALIC }],
    [['DEBUGGER_SMART_STEP_INTO_TARGET'], { bg: ui.selection }],
    [['DEBUGGER_SMART_STEP_INTO_SELECTION'], { bg: ui.selection, effect: [BOX, ui.focus] }],

    [['DIFF_INSERTED'], { bg: over('insertedLine'), stripe: vcs.added }],
    [['DIFF_DELETED'], { bg: over('removedLine'), stripe: vcs.deleted }],
    [['DIFF_MODIFIED'], { bg: over('insertedText'), stripe: vcs.modified }],
    [['DIFF_CONFLICT'], { bg: over('conflict'), stripe: vcs.conflict }],
    [['DELETED_TEXT_ATTRIBUTES'], { fg: s.text, bg: over('removedLine'), effect: [STRIKEOUT, s.text] }],
    [['LINE_FULL_COVERAGE'], { fg: vcs.added, font: BOLD }],
    [['LINE_PARTIAL_COVERAGE'], { fg: vcs.modified, font: BOLD }],
    [['LINE_NONE_COVERAGE'], { fg: vcs.deleted, font: BOLD }],

    [['CONSOLE_NORMAL_OUTPUT', 'CONSOLE_SYSTEM_OUTPUT'], { fg: ui.control }],
    [['CONSOLE_ERROR_OUTPUT', 'LOG_ERROR_OUTPUT'], { fg: ui.error }],
    [['LOG_WARNING_OUTPUT'], { fg: ui.warning }],
    [['LOG_INFO_OUTPUT'], { fg: s.green }],
    [['LOG_DEBUG_OUTPUT'], { fg: s.type }],
    [['LOG_VERBOSE_OUTPUT'], { fg: s.text }],
    [['LOG_EXPIRED_ENTRY'], { fg: ui.dim }],
    [['CONSOLE_USER_INPUT'], { fg: s.green, font: ITALIC }],
    [['CONSOLE_OUTPUT'], { bg: ui.surface }],
    [['CONSOLE_RANGE_TO_EXECUTE'], { effect: [BOX, ui.focus] }],
    [['CONSOLE_BLACK_OUTPUT'], consoleColor(ansi.black)],
    [['CONSOLE_RED_OUTPUT'], consoleColor(ansi.red)],
    [['CONSOLE_GREEN_OUTPUT'], consoleColor(ansi.green)],
    [['CONSOLE_YELLOW_OUTPUT'], consoleColor(ansi.yellow)],
    [['CONSOLE_BLUE_OUTPUT'], consoleColor(ansi.blue)],
    [['CONSOLE_MAGENTA_OUTPUT'], consoleColor(ansi.magenta)],
    [['CONSOLE_CYAN_OUTPUT'], consoleColor(ansi.cyan)],
    [['CONSOLE_GRAY_OUTPUT'], consoleColor(ansi.white)],
    [['CONSOLE_DARKGRAY_OUTPUT'], consoleColor(ansi.brightBlack)],
    [['CONSOLE_RED_BRIGHT_OUTPUT'], consoleColor(ansi.brightRed)],
    [['CONSOLE_GREEN_BRIGHT_OUTPUT'], consoleColor(ansi.brightGreen)],
    [['CONSOLE_YELLOW_BRIGHT_OUTPUT'], consoleColor(ansi.brightYellow)],
    [['CONSOLE_BLUE_BRIGHT_OUTPUT'], consoleColor(ansi.brightBlue)],
    [['CONSOLE_MAGENTA_BRIGHT_OUTPUT'], consoleColor(ansi.brightMagenta)],
    [['CONSOLE_CYAN_BRIGHT_OUTPUT'], consoleColor(ansi.brightCyan)],
    [['CONSOLE_WHITE_OUTPUT'], consoleColor(ansi.brightWhite)],
    [['BLOCK_TERMINAL_BLACK'], consoleColor(ansi.black)],
    [['BLOCK_TERMINAL_RED'], consoleColor(ansi.red)],
    [['BLOCK_TERMINAL_GREEN'], consoleColor(ansi.green)],
    [['BLOCK_TERMINAL_YELLOW'], consoleColor(ansi.yellow)],
    [['BLOCK_TERMINAL_BLUE'], consoleColor(ansi.blue)],
    [['BLOCK_TERMINAL_MAGENTA'], consoleColor(ansi.magenta)],
    [['BLOCK_TERMINAL_CYAN'], consoleColor(ansi.cyan)],
    [['BLOCK_TERMINAL_WHITE'], consoleColor(ansi.white)],
    [['BLOCK_TERMINAL_BLACK_BRIGHT'], consoleColor(ansi.brightBlack)],
    [['BLOCK_TERMINAL_RED_BRIGHT'], consoleColor(ansi.brightRed)],
    [['BLOCK_TERMINAL_GREEN_BRIGHT'], consoleColor(ansi.brightGreen)],
    [['BLOCK_TERMINAL_YELLOW_BRIGHT'], consoleColor(ansi.brightYellow)],
    [['BLOCK_TERMINAL_BLUE_BRIGHT'], consoleColor(ansi.brightBlue)],
    [['BLOCK_TERMINAL_MAGENTA_BRIGHT'], consoleColor(ansi.brightMagenta)],
    [['BLOCK_TERMINAL_CYAN_BRIGHT'], consoleColor(ansi.brightCyan)],
    [['BLOCK_TERMINAL_WHITE_BRIGHT'], consoleColor(ansi.brightWhite)],
    [['BLOCK_TERMINAL_COMMAND'], { fg: ui.foreground, font: BOLD }],
    [['BLOCK_TERMINAL_SEARCH_ENTRY'], { fg: bg, bg: s.string }],
    [['BLOCK_TERMINAL_CURRENT_SEARCH_ENTRY'], { fg: bg, bg: variant.accent }],

    [['LOGCAT_V2_LEVEL_VERBOSE'], { fg: bg, bg: s.text }],
    [['LOGCAT_V2_LEVEL_DEBUG'], { fg: bg, bg: s.type }],
    [['LOGCAT_V2_LEVEL_INFO'], { fg: bg, bg: s.green }],
    [['LOGCAT_V2_LEVEL_WARNING'], { fg: bg, bg: ui.warning }],
    [['LOGCAT_V2_LEVEL_ERROR'], { fg: bg, bg: ui.error }],
    [['LOGCAT_V2_LEVEL_ASSERT'], { fg: bg, bg: s.keyword }],
    [['LOGCAT_V2_MESSAGE_VERBOSE'], { fg: s.text }],
    [['LOGCAT_V2_MESSAGE_DEBUG'], { fg: s.type }],
    [['LOGCAT_V2_MESSAGE_INFO'], { fg: s.green }],
    [['LOGCAT_V2_MESSAGE_WARNING'], { fg: ui.warning }],
    [['LOGCAT_V2_MESSAGE_ERROR'], { fg: ui.error }],
    [['LOGCAT_V2_MESSAGE_ASSERT'], { fg: s.keyword }],
    [['LOGCAT_FILTER_KEY', 'LOGCAT_FILTER_KVALUE', 'LOGCAT_FILTER_STRING_KVALUE', 'LOGCAT_FILTER_REGEX_KVALUE'], { fg: ui.foreground, bg: ui.selection }],
  ]

  const lotus = withDeuteriumKeywords(lotusAttributes(), s.keyword)
  const like = key => lotus.get(key)

  // Keys Lotus Dark leaves unset but Darcula colors explicitly; without these, Darcula's palette
  // shows through between Lotus colors.
  const gaps = [
    [['KOTLIN_PACKAGE_FUNCTION_CALL', 'JS.INSTANCE_MEMBER_FUNCTION', 'NG.SIGNAL', 'XPATH.FUNCTION', 'com.jetbrains.cmake.COMMAND'], { base: 'DEFAULT_FUNCTION_CALL' }],
    [['OC.METHOD_DECLARATION'], { base: 'DEFAULT_FUNCTION_DECLARATION' }],
    [['KOTLIN_CLOSURE_DEFAULT_PARAMETER', 'KOTLIN_CONTEXT_ARGUMENT'], { base: 'DEFAULT_PARAMETER' }],
    [['KOTLIN_FUNCTION_LITERAL_BRACES_AND_ARROW'], { base: 'DEFAULT_BRACES' }],
    [['JS.LOCAL_VARIABLE', 'VELOCITY_REFERENCE'], { base: 'DEFAULT_LOCAL_VARIABLE' }],
    [['JS.GLOBAL_VARIABLE'], { base: 'DEFAULT_GLOBAL_VARIABLE' }],
    [['Static property reference ID'], { base: 'DEFAULT_STATIC_FIELD' }],
    [['JS.JSX_CLIENT_COMPONENT', 'SQL_SYNTHETIC_ENTITY', 'MERMAID_GENERIC'], { base: 'DEFAULT_CLASS_REFERENCE' }],
    [['Scala Type Alias', 'Scala Type parameter'], like('TYPE_PARAMETER_NAME_ATTRIBUTES')],
    [['SQL_OUTER_QUERY_COLUMN'], { base: 'DEFAULT_INSTANCE_FIELD' }],
    [['JS.REGEXP', 'CUSTOM_STRING_ATTRIBUTES', 'MERMAID_TITLE'], { base: 'DEFAULT_STRING' }],
    [['CUSTOM_VALID_STRING_ESCAPE_ATTRIBUTES'], { base: 'DEFAULT_VALID_STRING_ESCAPE' }],
    [['CUSTOM_KEYWORD3_ATTRIBUTES'], { base: 'DEFAULT_CONSTANT' }],
    [['VELOCITY_DIRECTIVE', 'MERMAID_KEYWORD'], { base: 'DEFAULT_KEYWORD' }],
    [['MERMAID_DIAGRAM_NAME'], { base: 'DEFAULT_CLASS_NAME' }],
    [['MERMAID_IDENTIFIER'], { base: 'DEFAULT_IDENTIFIER' }],
    [['MERMAID_EDGE'], { base: 'DEFAULT_OPERATION_SIGN' }],
    [['MERMAID_FRONTMATTER_DELIMITER'], { base: 'DEFAULT_COMMA' }],
    [['MERMAID_NOTE', 'TS.TYPE_GUARD'], {}],
    [['LESS_VARIABLE'], like('SASS_VARIABLE')],
    [['SASS_ATTRIBUTE'], like('CSS.PROPERTY_NAME')],
    [['SASS_CONSTANT'], like('CSS.PROPERTY_VALUE')],
    [['SASS_DIRECTIVE', 'SASS_RULE'], like('CSS.KEYWORD')],
    [['HTML_CUSTOM_TAG_NAME', 'XML_CUSTOM_TAG_NAME'], like('HTML_TAG_NAME')],
    [['MARKDOWN_HEADER'], like('MARKDOWN_HEADER_LEVEL_1')],
    ...[0, 1, 2, 3, 4].map(level => [[`RAINBOW_COLOR${level}`], like(`ROUND_BRACKETS_RAINBOW_COLOR${level}`)]),
    [['IntelliJComposableCallTextAttributes'], { fg: COMPOSABLE_CALL }],
  ]

  const owned = new Set([...chrome, ...gaps].flatMap(([keys]) => keys))
  const syntax = [...lotus.entries()]
    .filter(([key]) => key !== 'TEXT' && !owned.has(key))
    .map(([key, style]) => [[key], style])

  const attributes = [
    [['TEXT'], { fg: lotus.get('TEXT').fg, bg }],
    ...syntax,
    ...gaps,
    ...chrome,
  ]

  return { name: variant.name, colors, attributes }
}

// Lotus draws keywords in italic pinks; Deuterium keeps its own upright keyword red.
const LOTUS_PINKS = new Set(['#ff6188', '#ff4c8f'])

function withDeuteriumKeywords(attributes, keyword) {
  for (const [key, style] of attributes) {
    if (LOTUS_PINKS.has(style.fg)) style.fg = keyword
    if (key.includes('KEYWORD') && style.font === ITALIC) style.font = undefined
    if (key.includes('KEYWORD') && style.font === BOLD_ITALIC) style.font = BOLD
  }
  return attributes
}

function lotusAttributes() {
  const xml = readFileSync(LOTUS_SCHEME, 'utf8')
  const section = xml.slice(xml.indexOf('<attributes>'), xml.indexOf('</attributes>'))
  const entry = /<option name="([^"]+)"(?:\s+baseAttributes="([^"]+)")?\s*(?:\/>|>([\s\S]*?)<\/option>)/g
  const attributes = new Map()

  for (const [, key, base, body = ''] of section.matchAll(entry)) {
    if (base) {
      attributes.set(key, { base })
      continue
    }
    const values = Object.fromEntries([...body.matchAll(/<option name="(\w+)" value="([^"]*)"/g)].map(([, name, value]) => [name, value]))
    const color = name => (values[name] ? `#${values[name].toLowerCase()}` : undefined)
    attributes.set(key, {
      fg: color('FOREGROUND'),
      bg: color('BACKGROUND'),
      font: values.FONT_TYPE ? Number(values.FONT_TYPE) : undefined,
      effect: values.EFFECT_TYPE ? [Number(values.EFFECT_TYPE), color('EFFECT_COLOR') ?? ''] : undefined,
      stripe: color('ERROR_STRIPE_COLOR'),
    })
  }
  return attributes
}

export function schemeXml(scheme) {
  const hex = color => color.replace('#', '')
  const colorLines = Object.entries(scheme.colors).map(([name, value]) =>
    value === '' ? `    <option name="${name}" />` : `    <option name="${name}" value="${hex(value)}" />`)

  const attributeLines = []
  for (const [keys, style] of scheme.attributes) {
    for (const key of keys) {
      if (style.base) {
        attributeLines.push(`    <option name="${key}" baseAttributes="${style.base}" />`)
        continue
      }
      const values = []
      if (style.fg) values.push(['FOREGROUND', hex(style.fg)])
      if (style.bg) values.push(['BACKGROUND', hex(style.bg)])
      if (style.font) values.push(['FONT_TYPE', style.font])
      if (style.effect) {
        if (style.effect[1]) values.push(['EFFECT_COLOR', hex(style.effect[1])])
        values.push(['EFFECT_TYPE', style.effect[0]])
      }
      if (style.stripe) values.push(['ERROR_STRIPE_COLOR', hex(style.stripe)])
      const inner = values.map(([name, value]) => `        <option name="${name}" value="${value}" />`)
      attributeLines.push(
        `    <option name="${key}">`,
        inner.length ? ['      <value>', ...inner, '      </value>'].join('\n') : '      <value />',
        '    </option>',
      )
    }
  }

  return [
    `<scheme name="${scheme.name}" version="142" parent_scheme="Darcula">`,
    '  <colors>',
    ...colorLines,
    '  </colors>',
    '  <attributes>',
    ...attributeLines,
    '  </attributes>',
    '</scheme>',
    '',
  ].join('\n')
}
