import { useState } from 'react'
import type { TypographySettings } from '../types'
import { Slider } from './ui/Slider'
import { Button } from './ui/Button'

interface OverlayPanelProps {
  selected: string[]
  colors: Record<string, string>
  text: string
  settings: TypographySettings
  onRemove: (family: string) => void
  onClear: () => void
}

export function OverlayPanel({
  selected,
  colors,
  text,
  settings,
  onRemove,
  onClear,
}: OverlayPanelProps) {
  const [opacity, setOpacity] = useState(0.7)

  if (selected.length === 0) return null

  return (
    <div className="sticky bottom-0 z-20 max-h-[60vh] overflow-y-auto border-t border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="w-full">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Overlay ({selected.length})
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {selected.map((family) => (
              <button
                key={family}
                onClick={() => onRemove(family)}
                className="flex items-center gap-1.5 rounded-full bg-zinc-200 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                title="Click to remove"
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: colors[family] }}
                />
                {family}
                <span className="text-zinc-500">×</span>
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-end gap-4">
            <Slider
              label="Opacity"
              value={opacity}
              min={0.1}
              max={1}
              step={0.05}
              onChange={setOpacity}
            />
            <Button variant="ghost" onClick={onClear}>
              Clear all
            </Button>
          </div>
        </div>
        <div className="grid overflow-x-auto rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
          {selected.map((family) => (
            <p
              key={family}
              className="col-start-1 row-start-1 mix-blend-multiply dark:mix-blend-screen whitespace-pre-wrap break-words"
              style={{
                fontFamily: `"${family}"`,
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
                letterSpacing: `${settings.letterSpacing}em`,
                fontWeight: settings.fontWeight,
                color: colors[family],
                opacity,
              }}
            >
              {text || 'Type text to compare'}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
