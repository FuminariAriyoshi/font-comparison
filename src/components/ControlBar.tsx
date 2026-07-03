import type { FontSource, TypographySettings } from '../types'
import type { FontLanguageTab } from '../lib/fontLanguage'
import { Slider } from './ui/Slider'
import { Button } from './ui/Button'
import { LanguageTabs } from './LanguageTabs'
import { CategoryChips } from './CategoryChips'
import { cn } from '../lib/cn'

const COLUMN_OPTIONS = [1, 2, 3, 4, 6, 8, 10, 13] as const

const SOURCE_TABS: { key: FontSource; label: string }[] = [
  { key: 'local', label: 'Local' },
  { key: 'google', label: 'Google' },
  { key: 'morisawa', label: 'Morisawa' },
]

interface ControlBarProps {
  text: string
  onTextChange: (text: string) => void
  filter: string
  onFilterChange: (filter: string) => void
  settings: TypographySettings
  onSettingsChange: (settings: TypographySettings) => void
  onReset: () => void
  languageTab: FontLanguageTab
  languageCounts: Record<FontLanguageTab, number>
  onLanguageTabChange: (tab: FontLanguageTab) => void
  categories: { key: string; label: string }[]
  categoryCounts: Record<string, number>
  activeCategory: string
  onCategoryChange: (key: string) => void
  columns: number
  onColumnsChange: (columns: number) => void
  enabledSources: Record<FontSource, boolean>
  sourceCounts: Record<FontSource, number>
  onSourceToggle: (source: FontSource) => void
  theme: 'light' | 'dark'
  onThemeToggle: () => void
}

export function ControlBar({
  text,
  onTextChange,
  filter,
  onFilterChange,
  settings,
  onSettingsChange,
  onReset,
  languageTab,
  languageCounts,
  onLanguageTabChange,
  categories,
  categoryCounts,
  activeCategory,
  onCategoryChange,
  columns,
  onColumnsChange,
  enabledSources,
  sourceCounts,
  onSourceToggle,
  theme,
  onThemeToggle,
}: ControlBarProps) {
  const update = (patch: Partial<TypographySettings>) =>
    onSettingsChange({ ...settings, ...patch })

  return (
    <div className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-3">
          <LanguageTabs
            active={languageTab}
            counts={languageCounts}
            onChange={onLanguageTabChange}
          />
          <div className="flex gap-1 rounded-lg bg-zinc-200 p-1 dark:bg-zinc-900">
            {SOURCE_TABS.map((tab) => {
              const disabled = tab.key === 'morisawa' && languageTab !== 'ja'
              const enabled = enabledSources[tab.key] && !disabled
              return (
                <button
                  key={tab.key}
                  onClick={() => !disabled && onSourceToggle(tab.key)}
                  disabled={disabled}
                  title={
                    disabled
                      ? 'Morisawa is Japanese-only'
                      : tab.key === 'morisawa'
                        ? 'Guessed by font name — may miss or misclassify some fonts'
                        : enabled
                          ? `Exclude ${tab.label} fonts`
                          : `Include ${tab.label} fonts`
                  }
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    disabled
                      ? 'cursor-not-allowed text-zinc-300 dark:text-zinc-700'
                      : enabled
                        ? 'bg-emerald-500 text-white'
                        : 'text-zinc-400 line-through hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400',
                  )}
                >
                  {tab.label}
                  <span className="text-xs opacity-70 [text-decoration:none]">
                    {sourceCounts[tab.key]}
                  </span>
                </button>
              )
            })}
          </div>
          {categories.length > 0 && (
            <CategoryChips
              categories={categories}
              counts={categoryCounts}
              active={activeCategory}
              onChange={onCategoryChange}
            />
          )}
          <button
            onClick={onThemeToggle}
            title="Toggle background color"
            className="ml-auto flex items-center gap-1.5 rounded-lg bg-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <span
              className={cn(
                'inline-block h-3 w-3 rounded-full border',
                theme === 'dark'
                  ? 'border-zinc-500 bg-zinc-100'
                  : 'border-zinc-400 bg-zinc-900',
              )}
            />
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Type text to compare"
            className="min-w-64 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-indigo-400"
          />
          <input
            type="search"
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            placeholder="Filter by font name"
            className="w-48 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-indigo-400"
          />
        </div>
        <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
          <Slider
            label="Size"
            value={settings.fontSize}
            min={10}
            max={160}
            step={1}
            unit="px"
            onChange={(v) => update({ fontSize: v })}
          />
          <Slider
            label="Line Height"
            value={settings.lineHeight}
            min={0.8}
            max={3}
            step={0.05}
            onChange={(v) => update({ lineHeight: v })}
          />
          <Slider
            label="Tracking"
            value={settings.letterSpacing}
            min={-0.1}
            max={0.5}
            step={0.005}
            unit="em"
            onChange={(v) => update({ letterSpacing: v })}
          />
          <Slider
            label="Weight"
            value={settings.fontWeight}
            min={100}
            max={900}
            step={100}
            onChange={(v) => update({ fontWeight: v })}
          />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Columns</span>
            <div className="flex gap-0.5 rounded-lg bg-zinc-200 p-0.5 dark:bg-zinc-900">
              {COLUMN_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => onColumnsChange(n)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    columns === n
                      ? 'bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-900'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200',
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <Button variant="ghost" onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
