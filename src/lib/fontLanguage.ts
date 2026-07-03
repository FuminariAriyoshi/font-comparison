// フォント名から日本語対応フォントかどうかを判定する簡易ヒューリスティック
const JAPANESE_NAME_PATTERNS = [
  /hiragino/i,
  /yu (gothic|mincho|kyokasho)/i,
  /meiryo/i,
  /ms (p?gothic|p?mincho)/i,
  /osaka/i,
  /noto (sans|serif) (jp|cjk)/i,
  /rounded m\+/i,
  /m\+ 1/i,
  /kozuka|kozgo|kozmin/i,
  /ryumin/i,
  /shuei/i,
  /toppan/i,
  /a-otf/i,
  /ipa(ex)?(gothic|mincho|ゴシック|明朝)/i,
  /klee/i,
  /tsukushi/i,
  /kaku gothic|maru gothic/i,
  /kyokasho/i,
  /[぀-ヿ㐀-鿿]/,
]

// CJK統合漢字・ひらがな・カタカナの範囲を含むか
const CJK_PATTERN = /[぀-ヿ㐀-鿿豈-﫿]/

export function isJapaneseFont(family: string): boolean {
  if (CJK_PATTERN.test(family)) return true
  return JAPANESE_NAME_PATTERNS.some((re) => re.test(family))
}

export type FontLanguageTab = 'ja' | 'en'

// ---- カテゴリ分類（フォント名ベースのヒューリスティック） ----

export type EnCategory = 'sans' | 'serif' | 'mono' | 'script' | 'display' | 'other'
export type JaCategory = 'gothic' | 'mincho' | 'maru' | 'other'

const MONO_PATTERNS = [
  /mono(?!type)/i,
  /courier/i,
  /menlo/i,
  /monaco/i,
  /consolas/i,
  /fira code/i,
  /jetbrains/i,
  /source code/i,
  /inconsolata/i,
  /cascadia/i,
  /andale/i,
  /\bhack\b/i,
  /code\b/i,
]

const SCRIPT_PATTERNS = [
  /script/i,
  /brush/i,
  /hand(writ|written|writing)?\b/i,
  /comic/i,
  /marker/i,
  /chalkboard/i,
  /bradley/i,
  /snell/i,
  /zapfino/i,
  /savoye/i,
  /noteworthy/i,
  /cursive/i,
  /calligr/i,
  /pen\b/i,
  /ink\b/i,
]

const DISPLAY_PATTERNS = [
  /display/i,
  /impact/i,
  /poster/i,
  /stencil/i,
  /outline/i,
  /shadow/i,
  /western/i,
  /luminari/i,
  /papyrus/i,
  /herculanum/i,
  /copperplate/i,
  /chalkduster/i,
  /phosphate/i,
  /party/i,
  /playbill/i,
  /trattatello/i,
]

const SERIF_PATTERNS = [
  /serif/i, // sans は先に判定するのでここに来るのは真のセリフ
  /times/i,
  /georgia/i,
  /garamond/i,
  /baskerville/i,
  /didot/i,
  /palatino/i,
  /bodoni/i,
  /caslon/i,
  /minion/i,
  /charter/i,
  /book antiqua/i,
  /century/i,
  /cambria/i,
  /constantia/i,
  /hoefler/i,
  /iowan/i,
  /athelas/i,
  /sitka/i,
  /lora/i,
  /merriweather/i,
  /playfair/i,
  /crimson/i,
  /rockwell/i,
  /clarendon/i,
  /new york/i,
  /superclarendon/i,
  /typewriter/i,
]

const SANS_PATTERNS = [
  /sans/i,
  /grotesk|grotesque/i,
  /helvetica/i,
  /arial/i,
  /futura/i,
  /avenir/i,
  /verdana/i,
  /tahoma/i,
  /trebuchet/i,
  /segoe/i,
  /roboto/i,
  /geneva/i,
  /lucida grande/i,
  /optima/i,
  /seravek/i,
  /avant garde/i,
  /franklin/i,
  /myriad/i,
  /calibri/i,
  /candara/i,
  /corbel/i,
  /lato/i,
  /montserrat/i,
  /inter\b/i,
  /poppins/i,
  /sf pro/i,
  /san francisco/i,
  /gill\b/i,
  /din\b/i,
  /univers/i,
  /akzidenz/i,
]

// 絵文字・記号・アイコン系（ラテン文字位置にシンボルを割り当てるフォントを含む）
const SYMBOL_PATTERNS = [
  /emoji/i,
  /dingbat/i,
  /wingdings/i,
  /webdings/i,
  /symbol/i,
  /ornament/i,
  /\bicons?\b/i,
  /pictogra(ph|m)/i,
  /braille/i,
  /\bmath\b/i,
  /musical/i,
  /last resort/i,
  /bodoni ornaments/i,
]

export function isSymbolFontName(family: string): boolean {
  return SYMBOL_PATTERNS.some((re) => re.test(family))
}

export function classifyEnFont(family: string): EnCategory {
  if (isSymbolFontName(family)) return 'other'
  if (MONO_PATTERNS.some((re) => re.test(family))) return 'mono'
  if (SCRIPT_PATTERNS.some((re) => re.test(family))) return 'script'
  if (DISPLAY_PATTERNS.some((re) => re.test(family))) return 'display'
  if (/sans/i.test(family)) return 'sans'
  if (SERIF_PATTERNS.some((re) => re.test(family))) return 'serif'
  if (SANS_PATTERNS.some((re) => re.test(family))) return 'sans'
  return 'other'
}

export function classifyJaFont(family: string): JaCategory {
  if (/丸ゴ|maru go|rounded|じゅん|スーラ/i.test(family)) return 'maru'
  if (/明朝|mincho|serif.*(jp|cjk)|noto serif/i.test(family)) return 'mincho'
  if (/ゴシック|gothic|sans.*(jp|cjk)|noto sans|hiragino sans|meiryo|osaka/i.test(family))
    return 'gothic'
  return 'other'
}

// mono は sans に、display は script に統合して表示する
export function normalizeEnCategory(category: EnCategory): EnCategory {
  if (category === 'mono') return 'sans'
  if (category === 'display') return 'script'
  return category
}

export const EN_CATEGORY_LABELS: { key: EnCategory; label: string }[] = [
  { key: 'sans', label: 'Sans / Mono' },
  { key: 'serif', label: 'Serif' },
  { key: 'script', label: 'Script / Display' },
  { key: 'other', label: 'Other' },
]

export const JA_CATEGORY_LABELS: { key: JaCategory; label: string }[] = [
  { key: 'gothic', label: 'Gothic' },
  { key: 'mincho', label: 'Mincho' },
  { key: 'maru', label: 'Rounded' },
  { key: 'other', label: 'Other' },
]
