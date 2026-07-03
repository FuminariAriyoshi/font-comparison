import type { EnCategory, JaCategory } from '../lib/fontLanguage'

export interface GoogleFontDef {
  family: string
  ja: boolean
  category: EnCategory | JaCategory
}

const en = (family: string, category: EnCategory): GoogleFontDef => ({
  family,
  ja: false,
  category,
})
const ja = (family: string, category: JaCategory): GoogleFontDef => ({
  family,
  ja: true,
  category,
})

// 人気どころを厳選した Google Fonts リスト
export const GOOGLE_FONTS: GoogleFontDef[] = [
  // --- Sans ---
  en('Inter', 'sans'),
  en('Roboto', 'sans'),
  en('Open Sans', 'sans'),
  en('Lato', 'sans'),
  en('Montserrat', 'sans'),
  en('Poppins', 'sans'),
  en('Raleway', 'sans'),
  en('Nunito', 'sans'),
  en('Nunito Sans', 'sans'),
  en('Work Sans', 'sans'),
  en('Rubik', 'sans'),
  en('DM Sans', 'sans'),
  en('Manrope', 'sans'),
  en('Figtree', 'sans'),
  en('Outfit', 'sans'),
  en('Sora', 'sans'),
  en('Space Grotesk', 'sans'),
  en('Plus Jakarta Sans', 'sans'),
  en('Karla', 'sans'),
  en('Mulish', 'sans'),
  en('Barlow', 'sans'),
  en('Archivo', 'sans'),
  en('Josefin Sans', 'sans'),
  en('Quicksand', 'sans'),
  en('Cabin', 'sans'),
  en('Fira Sans', 'sans'),
  en('PT Sans', 'sans'),
  en('Source Sans 3', 'sans'),
  en('IBM Plex Sans', 'sans'),
  en('Noto Sans', 'sans'),
  en('Oswald', 'sans'),
  en('Urbanist', 'sans'),
  en('Lexend', 'sans'),
  en('Albert Sans', 'sans'),
  en('Onest', 'sans'),
  en('Schibsted Grotesk', 'sans'),
  en('Instrument Sans', 'sans'),
  en('Geist', 'sans'),
  // --- Serif ---
  en('Playfair Display', 'serif'),
  en('Merriweather', 'serif'),
  en('Lora', 'serif'),
  en('PT Serif', 'serif'),
  en('Noto Serif', 'serif'),
  en('Source Serif 4', 'serif'),
  en('Libre Baskerville', 'serif'),
  en('Crimson Pro', 'serif'),
  en('EB Garamond', 'serif'),
  en('Cormorant Garamond', 'serif'),
  en('Spectral', 'serif'),
  en('Bitter', 'serif'),
  en('Domine', 'serif'),
  en('Zilla Slab', 'serif'),
  en('Roboto Slab', 'serif'),
  en('Frank Ruhl Libre', 'serif'),
  en('Fraunces', 'serif'),
  en('Literata', 'serif'),
  en('Newsreader', 'serif'),
  en('DM Serif Display', 'serif'),
  en('Instrument Serif', 'serif'),
  en('Libre Caslon Text', 'serif'),
  // --- Mono ---
  en('Roboto Mono', 'mono'),
  en('JetBrains Mono', 'mono'),
  en('Fira Code', 'mono'),
  en('Source Code Pro', 'mono'),
  en('IBM Plex Mono', 'mono'),
  en('Space Mono', 'mono'),
  en('Inconsolata', 'mono'),
  en('Ubuntu Mono', 'mono'),
  en('DM Mono', 'mono'),
  en('Geist Mono', 'mono'),
  // --- Script / Handwriting ---
  en('Pacifico', 'script'),
  en('Dancing Script', 'script'),
  en('Caveat', 'script'),
  en('Lobster', 'script'),
  en('Great Vibes', 'script'),
  en('Satisfy', 'script'),
  en('Kalam', 'script'),
  en('Shadows Into Light', 'script'),
  en('Indie Flower', 'script'),
  en('Permanent Marker', 'script'),
  en('Courgette', 'script'),
  en('Sacramento', 'script'),
  // --- Display ---
  en('Bebas Neue', 'display'),
  en('Anton', 'display'),
  en('Abril Fatface', 'display'),
  en('Alfa Slab One', 'display'),
  en('Righteous', 'display'),
  en('Fredoka', 'display'),
  en('Bungee', 'display'),
  en('Archivo Black', 'display'),
  en('Passion One', 'display'),
  en('Titan One', 'display'),
  en('Amatic SC', 'display'),
  // --- 日本語 ---
  ja('Noto Sans JP', 'gothic'),
  ja('Noto Serif JP', 'mincho'),
  ja('M PLUS 1p', 'gothic'),
  ja('M PLUS 2', 'gothic'),
  ja('M PLUS Rounded 1c', 'maru'),
  ja('Zen Kaku Gothic New', 'gothic'),
  ja('Zen Kaku Gothic Antique', 'gothic'),
  ja('Zen Maru Gothic', 'maru'),
  ja('Zen Old Mincho', 'mincho'),
  ja('Zen Antique', 'mincho'),
  ja('Sawarabi Gothic', 'gothic'),
  ja('Sawarabi Mincho', 'mincho'),
  ja('Shippori Mincho', 'mincho'),
  ja('Shippori Mincho B1', 'mincho'),
  ja('Kosugi', 'gothic'),
  ja('Kosugi Maru', 'maru'),
  ja('BIZ UDGothic', 'gothic'),
  ja('BIZ UDPGothic', 'gothic'),
  ja('BIZ UDMincho', 'mincho'),
  ja('BIZ UDPMincho', 'mincho'),
  ja('Murecho', 'gothic'),
  ja('Kiwi Maru', 'maru'),
  ja('Klee One', 'other'),
  ja('Kaisei Decol', 'mincho'),
  ja('Kaisei Opti', 'mincho'),
  ja('Kaisei Tokumin', 'mincho'),
  ja('Hina Mincho', 'mincho'),
  ja('Yuji Syuku', 'other'),
  ja('Yusei Magic', 'other'),
  ja('Yomogi', 'other'),
  ja('Zen Kurenaido', 'other'),
  ja('Dela Gothic One', 'gothic'),
  ja('RocknRoll One', 'gothic'),
  ja('DotGothic16', 'gothic'),
  ja('Reggae One', 'other'),
  ja('Rampart One', 'other'),
  ja('Stick', 'gothic'),
  ja('Hachi Maru Pop', 'maru'),
  ja('Mochiy Pop One', 'maru'),
  ja('Mochiy Pop P One', 'maru'),
  ja('Potta One', 'maru'),
  ja('Train One', 'other'),
  ja('Shippori Antique', 'gothic'),
]

let injected = false

// Google Fonts の CSS を <link> で一括ロード（20ファミリーずつバッチ）
export function injectGoogleFonts() {
  if (injected) return
  injected = true

  const preconnect1 = document.createElement('link')
  preconnect1.rel = 'preconnect'
  preconnect1.href = 'https://fonts.googleapis.com'
  const preconnect2 = document.createElement('link')
  preconnect2.rel = 'preconnect'
  preconnect2.href = 'https://fonts.gstatic.com'
  preconnect2.crossOrigin = 'anonymous'
  document.head.append(preconnect1, preconnect2)

  const families = GOOGLE_FONTS.map((f) => f.family)
  for (let i = 0; i < families.length; i += 20) {
    const chunk = families.slice(i, i + 20)
    const params = chunk
      .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}`)
      .join('&')
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?${params}&display=swap`
    document.head.append(link)
  }
}
