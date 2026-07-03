// フォント名で分類できなかったフォントを、Canvas に実描画して字形から推定する
import { isSymbolFontName } from './fontLanguage'

let ctx: CanvasRenderingContext2D | null = null

function getCtx(): CanvasRenderingContext2D {
  if (!ctx) {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 200
    ctx = canvas.getContext('2d', { willReadFrequently: true })!
  }
  return ctx
}

function measure(font: string, text: string): number {
  const c = getCtx()
  c.font = font
  return c.measureText(text).width
}

// 指定文字を自前のグリフで描けるか（フォールバックと幅が変わるかで判定）
export function canRenderText(family: string, text: string): boolean {
  const q = `"${family.replace(/"/g, '')}"`
  return (
    measure(`64px ${q}, monospace`, text) !== measure('64px monospace', text) ||
    measure(`64px ${q}, serif`, text) !== measure('64px serif', text)
  )
}

export function isMonospaceFont(family: string): boolean {
  const q = `"${family.replace(/"/g, '')}"`
  const font = `64px ${q}, serif`
  return measure(font, 'iiii') === measure(font, 'mmmm')
}

interface InkData {
  data: Uint8ClampedArray
  width: number
  height: number
}

function drawGlyph(family: string, char: string): InkData | null {
  const c = getCtx()
  const { width, height } = c.canvas
  c.clearRect(0, 0, width, height)
  c.fillStyle = '#000'
  c.textBaseline = 'alphabetic'
  c.font = `140px "${family.replace(/"/g, '')}"`
  c.fillText(char, 30, 170)
  const img = c.getImageData(0, 0, width, height)
  return { data: img.data, width, height }
}

function inkAt(ink: InkData, x: number, y: number): boolean {
  return ink.data[(y * ink.width + x) * 4 + 3] > 60
}

// 各行のインク幅（左端〜右端）を返す
function rowWidths(ink: InkData): { top: number; bottom: number; widths: number[] } {
  const widths: number[] = []
  let top = -1
  let bottom = -1
  for (let y = 0; y < ink.height; y++) {
    let left = -1
    let right = -1
    for (let x = 0; x < ink.width; x++) {
      if (inkAt(ink, x, y)) {
        if (left < 0) left = x
        right = x
      }
    }
    widths.push(left < 0 ? 0 : right - left + 1)
    if (left >= 0) {
      if (top < 0) top = y
      bottom = y
    }
  }
  return { top, bottom, widths }
}

// 大文字 I の上端に横棒（セリフ）があるか
export function hasSerifs(family: string): boolean {
  const ink = drawGlyph(family, 'I')
  if (!ink) return false
  const { top, bottom, widths } = rowWidths(ink)
  if (top < 0 || bottom - top < 40) return false

  const h = bottom - top
  const topBand = widths.slice(top, top + Math.max(2, Math.round(h * 0.12)))
  const midBand = widths
    .slice(top + Math.round(h * 0.35), top + Math.round(h * 0.65))
    .filter((w) => w > 0)
  if (midBand.length === 0) return false

  const topMax = Math.max(...topBand)
  const midSorted = [...midBand].sort((a, b) => a - b)
  const midMedian = midSorted[Math.floor(midSorted.length / 2)]
  return topMax >= midMedian * 1.45
}

// テキストフォントの「.」はベースライン付近の小さな点。記号・アイコンフォントは
// ラテン文字位置に大きなシンボルを割り当てているため、インクの大きさで見分けられる
export function looksLikeSymbolFont(family: string): boolean {
  const ink = drawGlyph(family, '.')
  if (!ink) return false
  const { top, bottom, widths } = rowWidths(ink)
  if (top < 0) return true // 「.」すら描けない
  const inkHeight = bottom - top
  const inkWidth = Math.max(...widths)
  // 140px 描画でピリオドの縦横が 50px を超えることはまず無い
  return inkHeight > 50 || inkWidth > 50
}

// 「十」の横画と縦画の太さの比で明朝（横画が細い）かゴシック（均一）かを推定
export function looksLikeMincho(family: string): boolean {
  const ink = drawGlyph(family, '十')
  if (!ink) return false
  const { top, bottom } = rowWidths(ink)
  if (top < 0 || bottom - top < 60) return false

  // 縦画の太さ: 横棒より上の行で、インクの連続幅を測る
  const upperY = top + Math.round((bottom - top) * 0.15)
  let vertical = 0
  let run = 0
  for (let x = 0; x < ink.width; x++) {
    if (inkAt(ink, x, upperY)) run++
    else {
      vertical = Math.max(vertical, run)
      run = 0
    }
  }
  vertical = Math.max(vertical, run)

  // 横画の太さ: 縦棒より左の列で、インクの連続高さを測る
  let leftEdge = ink.width
  for (let x = 0; x < ink.width; x++) {
    if (inkAt(ink, x, top + Math.round((bottom - top) * 0.5))) {
      leftEdge = x
      break
    }
  }
  const probeX = Math.min(ink.width - 1, leftEdge + 8)
  let horizontal = 0
  run = 0
  for (let y = 0; y < ink.height; y++) {
    if (inkAt(ink, probeX, y)) run++
    else {
      horizontal = Math.max(horizontal, run)
      run = 0
    }
  }
  horizontal = Math.max(horizontal, run)

  if (vertical <= 0 || horizontal <= 0) return false
  return horizontal / vertical < 0.65
}

// ---- 名前で 'other' になったフォントの再分類（結果はキャッシュ） ----

const enCache = new Map<string, string>()
const jaCache = new Map<string, string>()

export function refineEnCategory(family: string): string {
  const cached = enCache.get(family)
  if (cached) return cached

  let result: string
  if (!canRenderText(family, 'ABCabc')) {
    result = 'other' // 記号・絵文字などラテン文字を持たないフォント
  } else if (isSymbolFontName(family) || looksLikeSymbolFont(family)) {
    result = 'other' // ラテン文字位置にシンボルを割り当てているフォント
  } else if (isMonospaceFont(family)) {
    result = 'sans' // Sans / Mono に統合
  } else {
    result = hasSerifs(family) ? 'serif' : 'sans'
  }
  enCache.set(family, result)
  return result
}

export function refineJaCategory(family: string): string {
  const cached = jaCache.get(family)
  if (cached) return cached
  const result = looksLikeMincho(family) ? 'mincho' : 'gothic'
  jaCache.set(family, result)
  return result
}
