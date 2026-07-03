import { useState } from 'react'
import type { TypographySettings } from '../types'
import { Button } from './ui/Button'
import { cn } from '../lib/cn'

interface SideBySidePanelProps {
  selected: string[]
  text: string
  settings: TypographySettings
  onRemove: (family: string) => void
  onClear: () => void
}

export function SideBySidePanel({
  selected,
  text,
  settings,
  onRemove,
  onClear,
}: SideBySidePanelProps) {
  const [copied, setCopied] = useState<string | null>(null)

  if (selected.length === 0) return null

  const handleCopy = (family: string) => {
    navigator.clipboard.writeText(family)
    setCopied(family)
    setTimeout(() => setCopied((prev) => (prev === family ? null : prev)), 1200)
  }

  return (
    <div className="sticky bottom-0 z-20 max-h-[50vh] overflow-y-auto border-t border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="w-full">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Side by side ({selected.length})
          </h2>
          <span className="text-xs text-zinc-500">Shift+Click to overlay instead</span>
          <Button variant="ghost" className="ml-auto" onClick={onClear}>
            Clear all
          </Button>
        </div>
        <div className="flex gap-4 overflow-x-auto rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
          {selected.map((family) => (
            <div key={family} className="min-w-52 flex-1 p-4">
              <div className="mb-2 flex items-center justify-between">
                <button
                  onClick={() => handleCopy(family)}
                  title="Click to copy font name"
                  className={cn(
                    'truncate text-left text-xs hover:underline',
                    copied === family
                      ? 'text-emerald-500 dark:text-emerald-400'
                      : 'text-zinc-500 dark:text-zinc-400',
                  )}
                >
                  {copied === family ? 'Copied!' : family}
                </button>
                <button
                  onClick={() => onRemove(family)}
                  className="text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
                  title="Remove"
                >
                  ×
                </button>
              </div>
              <p
                className="whitespace-pre-wrap break-words text-zinc-900 dark:text-zinc-100"
                style={{
                  fontFamily: `"${family}"`,
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: settings.lineHeight,
                  letterSpacing: `${settings.letterSpacing}em`,
                  fontWeight: settings.fontWeight,
                }}
              >
                {text || 'Type text to compare'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
