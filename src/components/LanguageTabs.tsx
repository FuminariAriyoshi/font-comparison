import type { FontLanguageTab } from '../lib/fontLanguage'
import { cn } from '../lib/cn'

interface LanguageTabsProps {
  active: FontLanguageTab
  counts: Record<FontLanguageTab, number>
  onChange: (tab: FontLanguageTab) => void
}

const TABS: { key: FontLanguageTab; label: string }[] = [
  { key: 'ja', label: 'Japanese' },
  { key: 'en', label: 'English' },
]

export function LanguageTabs({ active, counts, onChange }: LanguageTabsProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-zinc-200 p-1 dark:bg-zinc-900">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            active === tab.key
              ? 'bg-indigo-500 text-white'
              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200',
          )}
        >
          {tab.label}
          <span className="ml-1.5 text-xs opacity-70">{counts[tab.key]}</span>
        </button>
      ))}
    </div>
  )
}
