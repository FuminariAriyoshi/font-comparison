import { useEffect, useMemo, useState } from 'react'
import { useLocalFonts } from './hooks/useLocalFonts'
import type { FontSource, TypographySettings } from './types'
import {
  isJapaneseFont,
  classifyEnFont,
  classifyJaFont,
  normalizeEnCategory,
  EN_CATEGORY_LABELS,
  JA_CATEGORY_LABELS,
  type EnCategory,
  type FontLanguageTab,
} from './lib/fontLanguage'
import { refineEnCategory, refineJaCategory } from './lib/fontMetrics'
import { isMorisawaFont } from './lib/morisawa'
import { GOOGLE_FONTS, injectGoogleFonts } from './data/googleFonts'
import { ControlBar } from './components/ControlBar'
import { FontCard } from './components/FontCard'
import { OverlayPanel } from './components/OverlayPanel'
import { SideBySidePanel } from './components/SideBySidePanel'
import { Button } from './components/ui/Button'

const DEFAULT_SETTINGS: TypographySettings = {
  fontSize: 24,
  lineHeight: 1.4,
  letterSpacing: 0,
  fontWeight: 400,
}

const OVERLAY_COLORS = [
  '#f87171',
  '#4ade80',
  '#60a5fa',
  '#facc15',
  '#c084fc',
  '#fb923c',
  '#2dd4bf',
  '#f472b6',
]

const GRID_CLASSES: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  8: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-8',
  10: 'grid-cols-4 sm:grid-cols-5 lg:grid-cols-10',
  13: 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-[repeat(13,minmax(0,1fr))]',
}

interface ClassifiedFont {
  family: string
  styleCount: number
  ja: boolean
  category: string
  source: 'local' | 'google'
  morisawa: boolean
}

export default function App() {
  const { families, state, load } = useLocalFonts()
  const [text, setText] = useState('モリサワFont')
  const [filter, setFilter] = useState('')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [picked, setPicked] = useState<string[]>([])
  const [overlaid, setOverlaid] = useState<string[]>([])
  const [languageTab, setLanguageTab] = useState<FontLanguageTab>('ja')
  const [category, setCategory] = useState<string | null>(null)
  const [columns, setColumns] = useState(13)
  // Japanese => Local/Google/Morisawa、English => Local/Google を言語タブごとに独立管理
  const [jaSources, setJaSources] = useState<Record<FontSource, boolean>>({
    local: true,
    google: true,
    morisawa: true,
  })
  const [enSources, setEnSources] = useState<Record<FontSource, boolean>>({
    local: true,
    google: true,
    morisawa: false,
  })
  const enabledSources = languageTab === 'ja' ? jaSources : enSources
  const setEnabledSources = languageTab === 'ja' ? setJaSources : setEnSources
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Google Fonts の CSS は表示対象のときだけロード
  useEffect(() => {
    if (enabledSources.google) injectGoogleFonts()
  }, [enabledSources.google])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // 各ファミリーの言語・カテゴリを一度だけ計算し、ローカルとGoogleを統合
  const classified = useMemo<ClassifiedFont[]>(() => {
    const local = families.map((font) => {
      const ja = isJapaneseFont(font.family)
      // 名前で分類できなかったものは Canvas 描画による字形計測で再分類
      let category: string
      if (ja) {
        category = classifyJaFont(font.family)
        if (category === 'other') category = refineJaCategory(font.family)
      } else {
        category = normalizeEnCategory(classifyEnFont(font.family))
        if (category === 'other') category = refineEnCategory(font.family)
      }
      return {
        family: font.family,
        styleCount: font.styles.length,
        ja,
        category,
        source: 'local' as const,
        morisawa: isMorisawaFont(font.family),
      }
    })
    const google = GOOGLE_FONTS.map((g) => ({
      family: g.family,
      styleCount: 0,
      ja: g.ja,
      category: g.ja ? g.category : normalizeEnCategory(g.category as EnCategory),
      source: 'google' as const,
      morisawa: false,
    }))
    return [...local, ...google]
  }, [families])

  const sourceFiltered = useMemo(
    () =>
      classified.filter(
        (c) =>
          (c.source === 'local' && !c.morisawa && enabledSources.local) ||
          (c.source === 'google' && enabledSources.google) ||
          (c.morisawa && enabledSources.morisawa),
      ),
    [classified, enabledSources],
  )

  const sourceCounts = useMemo(() => {
    const morisawaCount = classified.filter((c) => c.morisawa).length
    return {
      local: families.length - morisawaCount,
      google: GOOGLE_FONTS.length,
      morisawa: morisawaCount,
    }
  }, [families.length, classified])

  const languageCounts = useMemo(() => {
    const counts: Record<FontLanguageTab, number> = { ja: 0, en: 0 }
    for (const c of sourceFiltered) {
      if (c.ja) counts.ja++
      else counts.en++
    }
    return counts
  }, [sourceFiltered])

  const categories = languageTab === 'ja' ? JA_CATEGORY_LABELS : EN_CATEGORY_LABELS

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const c of sourceFiltered) {
      if (c.ja !== (languageTab === 'ja')) continue
      counts[c.category] = (counts[c.category] ?? 0) + 1
    }
    return counts
  }, [sourceFiltered, languageTab])

  // 選択中カテゴリが空のときは件数のある先頭カテゴリに寄せる
  const effectiveCategory = useMemo(() => {
    if (category && (categoryCounts[category] ?? 0) > 0) return category
    const first = categories.find((c) => (categoryCounts[c.key] ?? 0) > 0)
    return first?.key ?? categories[0].key
  }, [category, categories, categoryCounts])

  const filtered = useMemo(() => {
    let list = sourceFiltered.filter(
      (c) => c.ja === (languageTab === 'ja') && c.category === effectiveCategory,
    )

    const q = filter.trim().toLowerCase()
    if (q) list = list.filter((c) => c.family.toLowerCase().includes(q))
    return list
  }, [sourceFiltered, filter, languageTab, effectiveCategory])

  const overlayColors = useMemo(() => {
    const map: Record<string, string> = {}
    overlaid.forEach((family, i) => {
      map[family] = OVERLAY_COLORS[i % OVERLAY_COLORS.length]
    })
    return map
  }, [overlaid])

  const handleTabChange = (tab: FontLanguageTab) => {
    setLanguageTab(tab)
    setCategory(null)
  }

  const handleSourceToggle = (s: FontSource) => {
    setEnabledSources((prev) => ({ ...prev, [s]: !prev[s] }))
  }

  const handleCardClick = (family: string, e: React.MouseEvent) => {
    if (e.shiftKey) {
      setOverlaid((prev) =>
        prev.includes(family) ? prev.filter((f) => f !== family) : [...prev, family],
      )
    } else {
      setPicked((prev) =>
        prev.includes(family) ? prev.filter((f) => f !== family) : [...prev, family],
      )
    }
  }

  const showLoadPrompt = state === 'idle'

  return (
    <div className="flex min-h-screen flex-col">
      <h1 className="sr-only">
        フォント比較ツール Font Compare — PC・Google Fonts・モリサワフォントを一覧で見比べ
      </h1>
      <ControlBar
        text={text}
        onTextChange={setText}
        filter={filter}
        onFilterChange={setFilter}
        settings={settings}
        onSettingsChange={setSettings}
        onReset={() => setSettings(DEFAULT_SETTINGS)}
        languageTab={languageTab}
        languageCounts={languageCounts}
        onLanguageTabChange={handleTabChange}
        categories={categories}
        categoryCounts={categoryCounts}
        activeCategory={effectiveCategory}
        onCategoryChange={setCategory}
        columns={columns}
        onColumnsChange={setColumns}
        enabledSources={enabledSources}
        sourceCounts={sourceCounts}
        onSourceToggle={handleSourceToggle}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />

      <main className="w-full flex-1 px-4 py-4">
        {showLoadPrompt && (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-3">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Local fonts are not loaded yet (showing Google Fonts only).
            </p>
            <Button onClick={load}>Load local fonts</Button>
          </div>
        )}

        {state === 'loading' && (
          <p className="mb-4 text-sm text-zinc-400">Loading local fonts…</p>
        )}

        {(state === 'fallback' || state === 'denied') && (
          <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
            {state === 'denied'
              ? 'Font access was denied — showing only common local fonts.'
              : 'This browser does not support queryLocalFonts — showing only common local fonts (Chrome / Edge recommended).'}
          </p>
        )}

        <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-600">
          {filtered.length} / {sourceFiltered.length} families ・ Click = side by side ・
          Shift+Click = overlay
        </p>
        <div className={`grid gap-x-2 gap-y-0.5 ${GRID_CLASSES[columns]}`}>
          {filtered.map((c) => (
            <FontCard
              key={`${c.source}:${c.family}`}
              font={{ family: c.family, styles: [], source: c.source }}
              text={text}
              settings={settings}
              picked={picked.includes(c.family)}
              overlaid={overlaid.includes(c.family)}
              overlayColor={overlayColors[c.family]}
              onClick={(e) => handleCardClick(c.family, e)}
            />
          ))}
        </div>
      </main>

      <SideBySidePanel
        selected={picked}
        text={text}
        settings={settings}
        onRemove={(family) => setPicked((prev) => prev.filter((f) => f !== family))}
        onClear={() => setPicked([])}
      />

      <OverlayPanel
        selected={overlaid}
        colors={overlayColors}
        text={text}
        settings={settings}
        onRemove={(family) => setOverlaid((prev) => prev.filter((f) => f !== family))}
        onClear={() => setOverlaid([])}
      />
    </div>
  )
}
