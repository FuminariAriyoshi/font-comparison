import { cn } from '../lib/cn'

interface CategoryChipsProps {
  categories: { key: string; label: string }[]
  counts: Record<string, number>
  active: string
  onChange: (key: string) => void
}

export function CategoryChips({ categories, counts, active, onChange }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {categories.map((cat) =>
        (counts[cat.key] ?? 0) === 0 ? null : (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              active === cat.key
                ? 'bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-900'
                : 'bg-zinc-200 text-zinc-500 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200',
            )}
          >
            {cat.label}
            <span className="ml-1 opacity-60">{counts[cat.key]}</span>
          </button>
        ),
      )}
    </div>
  )
}
