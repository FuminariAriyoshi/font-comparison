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

  const handleCopyName = (family: string) => {
    navigator.clipboard.writeText(family)
    setCopied(family)
    setTimeout(() => setCopied((prev) => (prev === family ? null : prev)), 1200)
  }

  // Figma はクリップボードの text/html をリッチテキストとして読み取れるため、
  // フォント・サイズ・行間・字間を反映した span を貼り付ける
  const handleCopyStyled = async (family: string) => {
    const content = text || 'Type text to compare'
    const html = `<span style="font-family:'${family}';font-size:${settings.fontSize}px;line-height:${settings.lineHeight};letter-spacing:${settings.letterSpacing}em;font-weight:${settings.fontWeight};">${content}</span>`

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([content], { type: 'text/plain' }),
        }),
      ])
    } catch {
      await navigator.clipboard.writeText(content)
    }

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
                  onClick={() => handleCopyName(family)}
                  title="Click to copy font name"
                  className="truncate text-left text-xs text-zinc-500 hover:underline dark:text-zinc-400"
                >
                  {family}
                </button>
                <button
                  onClick={() => onRemove(family)}
                  className="text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
                  title="Remove"
                >
                  ×
                </button>
              </div>
              <button
                onClick={() => handleCopyStyled(family)}
                title="Click to copy as styled text (paste into Figma)"
                className={cn(
                  'block w-full whitespace-pre-wrap break-words text-left transition-opacity hover:opacity-70',
                  copied === family
                    ? 'text-emerald-500 dark:text-emerald-400'
                    : 'text-zinc-900 dark:text-zinc-100',
                )}
                style={{
                  fontFamily: `"${family}"`,
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: settings.lineHeight,
                  letterSpacing: `${settings.letterSpacing}em`,
                  fontWeight: settings.fontWeight,
                }}
              >
                {copied === family ? 'Copied! Paste into Figma' : text || 'Type text to compare'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
