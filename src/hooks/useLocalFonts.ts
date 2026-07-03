import { useCallback, useState } from 'react'
import type { FontFamily } from '../types'

// queryLocalFonts が使えない環境向けの代表的なフォールバック
const FALLBACK_FAMILIES = [
  'Hiragino Sans',
  'Hiragino Mincho ProN',
  'Hiragino Maru Gothic ProN',
  'Yu Gothic',
  'Yu Mincho',
  'Helvetica Neue',
  'Helvetica',
  'Arial',
  'Avenir Next',
  'Futura',
  'Georgia',
  'Gill Sans',
  'Times New Roman',
  'Courier New',
  'Menlo',
  'Monaco',
  'SF Pro',
  'Verdana',
  'Trebuchet MS',
  'Optima',
  'Palatino',
  'Baskerville',
  'Didot',
  'American Typewriter',
  'Chalkboard SE',
  'Impact',
]

export type FontLoadState = 'idle' | 'loading' | 'loaded' | 'fallback' | 'denied'

export function useLocalFonts() {
  const [families, setFamilies] = useState<FontFamily[]>([])
  const [state, setState] = useState<FontLoadState>('idle')

  const load = useCallback(async () => {
    setState('loading')

    if (!window.queryLocalFonts) {
      setFamilies(FALLBACK_FAMILIES.map((f) => ({ family: f, styles: [] })))
      setState('fallback')
      return
    }

    try {
      const fonts = await window.queryLocalFonts()
      const map = new Map<string, FontFamily>()
      for (const font of fonts) {
        const entry = map.get(font.family)
        if (entry) {
          entry.styles.push(font)
        } else {
          map.set(font.family, { family: font.family, styles: [font] })
        }
      }
      const sorted = [...map.values()].sort((a, b) =>
        a.family.localeCompare(b.family, 'ja'),
      )
      setFamilies(sorted)
      setState('loaded')
    } catch {
      // 権限拒否など
      setFamilies(FALLBACK_FAMILIES.map((f) => ({ family: f, styles: [] })))
      setState('denied')
    }
  }, [])

  return { families, state, load }
}
